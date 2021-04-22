import {
  Class,
  Classes,
  Field,
  Function,
  Global,
  Libraries,
  Library,
  Method,
  Parameter,
  Shape,
  Type,
} from "../model/model";
import {
  ClassMemberType,
  TopLevelItemRef,
  TopLevelItemType,
  TopLevelRef,
} from "../model/reference";
import {
  ToitClass,
  ToitField,
  ToitFunction,
  ToitGlobal,
  ToitLibrary,
  ToitModule,
  ToitParameter,
  ToitReference,
  ToitShape,
  ToitType,
} from "./sdk";

function libraryName(name: string): string {
  return name.endsWith(".toit") ? name.substring(0, name.length - 5) : name;
}

function referenceFrom(toitReference: ToitReference): TopLevelItemRef {
  const path = toitReference.path.map((s) => libraryName(s));
  path.shift(); // Get rid of first "lib" entry. TODO (rikke): Find a more general rule.

  return {
    name: toitReference.name,
    libraryRef: { name: toitReference.name, path: path },
  };
}

function typeFrom(toitType: ToitType): Type {
  const reference = toitType.reference
    ? referenceFrom(toitType.reference)
    : undefined;

  return {
    isNone: toitType.is_none,
    isAny: toitType.is_any,
    isBlock: toitType.is_block,
    reference: reference,
  };
}

function shapeFrom(toitShape: ToitShape): Shape {
  return {
    arity: toitShape.arity,
    totalBlockCount: toitShape.total_block_count,
    namedBlockCount: toitShape.named_block_count,
    isSetter: toitShape.is_setter,
    names: toitShape.names,
  };
}

function parameterFrom(toitParameter: ToitParameter): Parameter {
  return {
    name: toitParameter.name,
    isBlock: toitParameter.is_block,
    isNamed: toitParameter.is_named,
    isRequired: toitParameter.is_required,
    type: typeFrom(toitParameter.type),
  };
}

function fieldFrom(
  toitField: ToitField,
  classRef: TopLevelItemRef,
  offset: number
): Field {
  return {
    name: toitField.name,
    id: {
      name: toitField.name,
      classRef: classRef,
      type: "field",
      offset: offset,
    },
    type: typeFrom(toitField.type),
    toitdoc: toitField.toitdoc,
  };
}

function methodFrom(
  toitMethod: ToitFunction,
  classRef: TopLevelItemRef,
  type: ClassMemberType,
  offset: number
): Method {
  const parameters = toitMethod.parameters.map((parameter) =>
    parameterFrom(parameter)
  );

  return {
    name: toitMethod.name,
    id: {
      name: toitMethod.name,
      classRef: classRef,
      type: type,
      offset: offset,
    },
    parameters: parameters,
    returnType: typeFrom(toitMethod.return_type),
    toitdoc: toitMethod.toitdoc,
    shape: shapeFrom(toitMethod.shape),
  };
}

function classFrom(
  toitClass: ToitClass,
  libraryRef: TopLevelRef,
  type: TopLevelItemType,
  offset: number
): Class {
  const classId = {
    name: toitClass.name,
    libraryRef: libraryRef,
    type: type,
    offset: offset,
  };

  const extend = toitClass.extends
    ? referenceFrom(toitClass.extends)
    : undefined;

  const fields = toitClass.structure.fields.map((field, index) =>
    fieldFrom(field, classId, index)
  );
  const constructors = toitClass.structure.constructors
    .concat(toitClass.structure.factories)
    .map((constructor, index) =>
      methodFrom(constructor, classId, "constructor", index)
    );
  const statics = toitClass.structure.statics.map((statik, index) =>
    methodFrom(statik, classId, "static", index)
  );
  const methods = toitClass.structure.methods.map((method, index) =>
    methodFrom(method, classId, "method", index)
  );

  return {
    name: toitClass.name,
    id: classId,
    extends: extend,
    fields: fields,
    constructors: constructors,
    statics: statics,
    methods: methods,
    toitdoc: toitClass.toitdoc,
  };
}

function globalFrom(
  toitGlobal: ToitGlobal,
  libraryRef: TopLevelRef,
  type: TopLevelItemType,
  offset: number
): Global {
  return {
    name: toitGlobal.name,
    id: {
      name: toitGlobal.name,
      libraryRef: libraryRef,
      type: type,
      offset: offset,
    },
    toitdoc: toitGlobal.toitdoc,
  };
}

function functionFrom(
  toitFunction: ToitFunction,
  libraryRef: TopLevelRef,
  type: TopLevelItemType,
  offset: number
): Function {
  const parameters = toitFunction.parameters.map((parameter) =>
    parameterFrom(parameter)
  );

  return {
    name: toitFunction.name,
    id: {
      name: toitFunction.name,
      libraryRef: libraryRef,
      type: type,
      offset: offset,
    },
    parameters: parameters,
    returnType: typeFrom(toitFunction.return_type),
    toitdoc: toitFunction.toitdoc,
    shape: shapeFrom(toitFunction.shape),
  };
}

function libraryFromModule(toitModule: ToitModule, path: string[]): Library {
  const name = libraryName(toitModule.name);
  const libraryId = { name: name, path: [...path, name] };

  let classes = {} as Classes;
  let exportedClasses = {} as Classes;

  toitModule.classes.forEach((klass, index) => {
    classes = {
      ...classes,
      [klass.name]: classFrom(klass, libraryId, "class", index),
    };
  });
  toitModule.export_classes.forEach((klass, index) => {
    exportedClasses = {
      ...exportedClasses,
      [klass.name]: classFrom(klass, libraryId, "exported_class", index),
    };
  });
  const globals = toitModule.globals.map((global, index) =>
    globalFrom(global, libraryId, "global", index)
  );
  const exportedGlobals = toitModule.export_globals.map((global, index) =>
    globalFrom(global, libraryId, "exported_global", index)
  );
  const functions = toitModule.functions.map((f, index) =>
    functionFrom(f, libraryId, "function", index)
  );
  const exportedFunctions = toitModule.export_functions.map((f, index) =>
    functionFrom(f, libraryId, "exported_function", index)
  );

  return {
    name: name,
    id: libraryId,
    libraries: {},
    classes: classes,
    exportedClasses: exportedClasses,
    globals: globals,
    exportedGlobals: exportedGlobals,
    functions: functions,
    exportedFunctions: exportedFunctions,
  };
}

function mergeLibraries(library: Library, otherLibrary: Library): Library {
  if (library.name !== otherLibrary.name) {
    throw Error("Only libraries with the same name can be merged");
  }
  if (JSON.stringify(library.id) !== JSON.stringify(otherLibrary.id)) {
    throw Error("Only libraries with the same id can be merged");
  }
  return {
    name: library.name,
    id: library.id,
    libraries: { ...library.libraries, ...otherLibrary.libraries },
    classes: { ...library.classes, ...otherLibrary.classes },
    exportedClasses: {
      ...library.exportedClasses,
      ...otherLibrary.exportedClasses,
    },
    globals: { ...library.globals, ...otherLibrary.globals },
    exportedGlobals: {
      ...library.exportedGlobals,
      ...otherLibrary.exportedGlobals,
    },
    functions: { ...library.functions, ...otherLibrary.functions },
    exportedFunctions: {
      ...library.exportedFunctions,
      ...otherLibrary.exportedFunctions,
    },
  };
}

function libraryFromLibrary(
  toitLibrary: ToitLibrary,
  path: string[],
  root?: boolean
): Library {
  let libraries = {} as Libraries;

  const name = toitLibrary.name;
  const libraryPath = root ? [] : [...path, name];

  Object.values(toitLibrary.libraries).forEach((lib) => {
    if (libraries[lib.name]) {
      console.log("Name clash", lib.name);
    }
    libraries = {
      ...libraries,
      [lib.name]: libraryFromLibrary(lib, libraryPath),
    };
  });

  let libraryContent = undefined as Library | undefined;

  Object.values(toitLibrary.modules).forEach((module) => {
    const subLibraryName = libraryName(module.name);
    if (subLibraryName === name) {
      libraryContent = libraryFromModule(module, path);
      return;
    }
    if (libraries[subLibraryName]) {
      console.log("Name clash", subLibraryName);
      const libLibrary = libraries[subLibraryName];
      libraries = {
        ...libraries,
        [subLibraryName]: mergeLibraries(
          libLibrary,
          libraryFromModule(module, libraryPath)
        ),
      };
      return;
    }
    libraries = {
      ...libraries,
      [subLibraryName]: libraryFromModule(module, libraryPath),
    };
  });

  return {
    name: name,
    id: { name: name, path: libraryPath },
    libraries: libraries,
    classes: libraryContent ? libraryContent.classes : {},
    exportedClasses: libraryContent ? libraryContent.exportedClasses : {},
    globals: libraryContent ? libraryContent.globals : [],
    exportedGlobals: libraryContent ? libraryContent.exportedGlobals : [],
    functions: libraryContent ? libraryContent.functions : [],
    exportedFunctions: libraryContent ? libraryContent.exportedFunctions : [],
  };
}

export function modelFrom(rootLibrary: ToitLibrary): Libraries {
  const model = libraryFromLibrary(rootLibrary, [], true).libraries;
  console.log(model);
  return model;
}
