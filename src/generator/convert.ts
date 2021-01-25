import {
  Class,
  Classes,
  Field,
  Function,
  Global,
  Method,
  Module,
  Modules,
  Parameter,
  Type,
} from "../model/model";
import {
  ClassMemberType,
  TopLevelItemRef,
  TopLevelItemType,
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
  ToitType,
} from "./sdk";

function moduleName(name: string): string {
  return name.endsWith(".toit") ? name.substring(0, name.length - 5) : name;
}

function referenceFrom(toitReference: ToitReference): TopLevelItemRef {
  const path = toitReference.path.map((s) => moduleName(s));
  path.shift(); // Get rid of first "lib" entry. TODO (rikke): Find a more general rule.

  return {
    name: toitReference.name,
    path: path,
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
  path: string[],
  classOffset: number,
  offset: number
): Field {
  return {
    name: toitField.name,
    id: {
      name: toitField.name,
      path: path,
      classOffset: classOffset,
      type: "field",
      offset: offset,
    },
    type: typeFrom(toitField.type),
    toitdoc: toitField.toitdoc,
  };
}

function methodFrom(
  toitMethod: ToitFunction,
  path: string[],
  classOffset: number,
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
      path: path,
      classOffset: classOffset,
      type: type,
      offset: offset,
    },
    parameters: parameters,
    returnType: typeFrom(toitMethod.return_type),
    toitdoc: toitMethod.toitdoc,
  };
}

function classFrom(
  toitClass: ToitClass,
  path: string[],
  type: TopLevelItemType,
  offset: number
): Class {
  const extend = toitClass.extends
    ? referenceFrom(toitClass.extends)
    : undefined;

  const fields = toitClass.structure.fields.map((field, index) =>
    fieldFrom(field, path, offset, index)
  );
  const constructors = toitClass.structure.constructors
    .concat(toitClass.structure.factories)
    .map((constructor, index) =>
      methodFrom(constructor, path, offset, "constructor", index)
    );
  const statics = toitClass.structure.statics.map((statik, index) =>
    methodFrom(statik, path, offset, "static", index)
  );
  const methods = toitClass.structure.methods.map((method, index) =>
    methodFrom(method, path, offset, "method", index)
  );

  return {
    name: toitClass.name,
    id: { name: toitClass.name, path: path, type: type, offset: offset },
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
  path: string[],
  type: TopLevelItemType,
  offset: number
): Global {
  return {
    name: toitGlobal.name,
    id: { name: toitGlobal.name, path: path, type: type, offset: offset },
    toitdoc: toitGlobal.toitdoc,
  };
}

function functionFrom(
  toitFunction: ToitFunction,
  path: string[],
  type: TopLevelItemType,
  offset: number
): Function {
  const parameters = toitFunction.parameters.map((parameter) =>
    parameterFrom(parameter)
  );

  return {
    name: toitFunction.name,
    id: { name: toitFunction.name, path: path, type: type, offset: offset },
    parameters: parameters,
    returnType: typeFrom(toitFunction.return_type),
    toitdoc: toitFunction.toitdoc,
  };
}

function moduleFromModule(toitModule: ToitModule, path: string[]): Module {
  const name = moduleName(toitModule.name);
  const modulePath = [...path, name];

  let classes = {} as Classes;
  let exportedClasses = {} as Classes;

  toitModule.classes.forEach((klass, index) => {
    classes = {
      ...classes,
      [klass.name]: classFrom(klass, modulePath, "class", index),
    };
  });
  toitModule.export_classes.forEach((klass, index) => {
    exportedClasses = {
      ...exportedClasses,
      [klass.name]: classFrom(klass, modulePath, "exported_class", index),
    };
  });
  const globals = toitModule.globals.map((global, index) =>
    globalFrom(global, modulePath, "global", index)
  );
  const exportedGlobals = toitModule.export_globals.map((global, index) =>
    globalFrom(global, modulePath, "exported_global", index)
  );
  const functions = toitModule.functions.map((f, index) =>
    functionFrom(f, modulePath, "function", index)
  );
  const exportedFunctions = toitModule.export_functions.map((f, index) =>
    functionFrom(f, modulePath, "exported_function", index)
  );

  return {
    name: name,
    id: { name: name, path: modulePath },
    modules: {},
    classes: classes,
    exportedClasses: exportedClasses,
    globals: globals,
    exportedGlobals: exportedGlobals,
    functions: functions,
    exportedFunctions: exportedFunctions,
  };
}

function mergeModules(module: Module, otherModule: Module): Module {
  if (module.name !== otherModule.name) {
    throw Error("Only modules with the same name can be merged");
  }
  if (JSON.stringify(module.id) !== JSON.stringify(otherModule.id)) {
    throw Error("Only modules with the same id can be merged");
  }
  return {
    name: module.name,
    id: module.id,
    modules: { ...module.modules, ...otherModule.modules },
    classes: { ...module.classes, ...otherModule.classes },
    exportedClasses: {
      ...module.exportedClasses,
      ...otherModule.exportedClasses,
    },
    globals: { ...module.globals, ...otherModule.globals },
    exportedGlobals: {
      ...module.exportedGlobals,
      ...otherModule.exportedGlobals,
    },
    functions: { ...module.functions, ...otherModule.functions },
    exportedFunctions: {
      ...module.exportedFunctions,
      ...otherModule.exportedFunctions,
    },
  };
}

function moduleFromLibrary(
  toitLibrary: ToitLibrary,
  path: string[],
  root?: boolean
): Module {
  let modules = {} as Modules;

  const name = toitLibrary.name;
  const modulePath = root ? [] : [...path, name];

  Object.values(toitLibrary.libraries).forEach((lib) => {
    if (modules[lib.name]) {
      console.log("Name clash", lib.name);
    }
    modules = { ...modules, [lib.name]: moduleFromLibrary(lib, modulePath) };
  });

  let moduleContent = undefined as Module | undefined;

  Object.values(toitLibrary.modules).forEach((module) => {
    const subModuleName = moduleName(module.name);
    if (subModuleName === name) {
      moduleContent = moduleFromModule(module, path);
      return;
    }
    if (modules[subModuleName]) {
      console.log("Name clash", subModuleName);
      const libModule = modules[subModuleName];
      modules = {
        ...modules,
        [subModuleName]: mergeModules(
          libModule,
          moduleFromModule(module, modulePath)
        ),
      };
      return;
    }
    modules = {
      ...modules,
      [subModuleName]: moduleFromModule(module, modulePath),
    };
  });

  return {
    name: name,
    id: { name: name, path: modulePath },
    modules: modules,
    classes: moduleContent ? moduleContent.classes : {},
    exportedClasses: moduleContent ? moduleContent.exportedClasses : {},
    globals: moduleContent ? moduleContent.globals : [],
    exportedGlobals: moduleContent ? moduleContent.exportedGlobals : [],
    functions: moduleContent ? moduleContent.functions : [],
    exportedFunctions: moduleContent ? moduleContent.exportedFunctions : [],
  };
}

export function modelFrom(rootLibrary: ToitLibrary): Modules {
  const model = moduleFromLibrary(rootLibrary, [], true).modules;

  console.log(model);
  return model;
}