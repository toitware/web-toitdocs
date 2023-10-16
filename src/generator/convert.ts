import { ViewMode } from "../App";
import {
  Category,
  CATEGORY_FUNDAMENTAL,
  CATEGORY_JUST_THERE,
  CATEGORY_MISC,
  CATEGORY_SUB,
  CLASS_KIND_CLASS,
  CLASS_KIND_INTERFACE,
  CLASS_KIND_MIXIN,
  ClassKind,
  Class,
  Classes,
  Doc,
  DocExpression,
  DocSection,
  DocStatement,
  DOC_DOCREF,
  DOC_EXPRESSION_CODE,
  DOC_EXPRESSION_TEXT,
  DOC_STATEMENT_CODE_SECTION,
  DOC_STATEMENT_ITEM,
  DOC_STATEMENT_ITEMIZED,
  DOC_STATEMENT_PARAGRAPH,
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
  LinkRef,
  LinkRefKind,
  TopLevelItemRef,
  TopLevelItemType,
  TopLevelRef,
} from "../model/reference";
import {
  OBJECT_TYPE_EXPRESSION_CODE,
  OBJECT_TYPE_EXPRESSION_TEXT,
  OBJECT_TYPE_STATEMENT_CODE_SECTION,
  OBJECT_TYPE_STATEMENT_ITEMIZED,
  OBJECT_TYPE_STATEMENT_PARAGRAPH,
  OBJECT_TYPE_TOITDOCREF,
  ToitCategory,
  TOIT_CLASS_KIND_CLASS,
  TOIT_CLASS_KIND_INTERFACE,
  TOIT_CLASS_KIND_MIXIN,
  ToitClassKind,
  ToitClass,
  ToitDoc,
  ToitDocRef,
  ToitDocRefKind,
  ToitExpression,
  ToitField,
  ToitFunction,
  ToitGlobal,
  ToitLibrary,
  ToitModule,
  ToitParameter,
  ToitReference,
  ToitSection,
  ToitShape,
  ToitStatement,
  ToitType,
  TOIT_CATEGORY_FUNDAMENTAL,
  TOIT_CATEGORY_JUST_THERE,
  TOIT_CATEGORY_MISC,
  TOIT_CATEGORY_SUB,
} from "./doc";

function libraryName(name: string): string {
  return name.endsWith(".toit") ? name.substring(0, name.length - 5) : name;
}

function pathFrom(path: string[]): string[] {
  const result = path.slice();
  result.shift(); // Get rid of first "lib" entry. TODO (rikke): Find a more general rule.
  const len = result.length;
  if (len === 0) return result;
  result[len - 1] = libraryName(result[len - 1]);
  if (len === 1) return result;
  if (result[len - 1] === result[len - 2]) {
    // Something like lib/net/net.toit.
    // In that case the net.toit is presented as 'lib.net' (as this is how it would
    // be imported).
    result.length--;
  }
  return result;
}

function shapeFrom(toitShape: ToitShape): Shape {
  return {
    arity: toitShape.arity,
    totalBlockCount: toitShape.total_block_count,
    namedBlockCount: toitShape.named_block_count,
    names: toitShape.names,
  };
}

function linkRefKindFrom(toitDocRefKind: ToitDocRefKind): LinkRefKind {
  switch (toitDocRefKind) {
    case "other":
      return "other";
    case "class":
      return "class";
    case "global":
      return "global";
    case "global-method":
      return "global-method";
    case "static-method":
      return "static-method";
    case "constructor":
      return "constructor";
    case "factory":
      return "factory";
    case "method":
      return "method";
    case "field":
      return "field";
    default:
      console.error("Unknown ToitDocRefKind", toitDocRefKind);
      return "unknown";
  }
}

function linkRefFrom(toitDocRef: ToitDocRef): LinkRef {
  let path = [] as string[];
  if (toitDocRef.path) {
    path = pathFrom(toitDocRef.path);
  }

  return {
    kind: linkRefKindFrom(toitDocRef.kind),
    path: path,
    holder: toitDocRef.holder || "",
    name: toitDocRef.name,
    shape: toitDocRef.shape ? shapeFrom(toitDocRef.shape) : undefined,
  };
}

function docExpressionFrom(toitExpression: ToitExpression): DocExpression {
  switch (toitExpression.object_type) {
    case OBJECT_TYPE_EXPRESSION_CODE:
      return {
        type: DOC_EXPRESSION_CODE,
        text: toitExpression.text,
      };
    case OBJECT_TYPE_EXPRESSION_TEXT:
      return {
        type: DOC_EXPRESSION_TEXT,
        text: toitExpression.text,
      };
    case OBJECT_TYPE_TOITDOCREF:
      return {
        type: DOC_DOCREF,
        text: toitExpression.text,
        reference: linkRefFrom(toitExpression),
      };
  }
}

function docStatementFrom(toitStatement: ToitStatement): DocStatement {
  switch (toitStatement.object_type) {
    case OBJECT_TYPE_STATEMENT_PARAGRAPH:
      return {
        type: DOC_STATEMENT_PARAGRAPH,
        expressions: toitStatement.expressions.map((toitExpression) =>
          docExpressionFrom(toitExpression)
        ),
      };
    case OBJECT_TYPE_STATEMENT_ITEMIZED:
      return {
        type: DOC_STATEMENT_ITEMIZED,
        items: toitStatement.items.map((toitItem) => {
          return {
            type: DOC_STATEMENT_ITEM,
            statements: toitItem.statements.map((s) => docStatementFrom(s)),
          };
        }),
      };
    case OBJECT_TYPE_STATEMENT_CODE_SECTION:
      return {
        type: DOC_STATEMENT_CODE_SECTION,
        text: toitStatement.text,
      };
  }
}

function docSectionFrom(toitSection: ToitSection): DocSection {
  return {
    title: toitSection.title,
    statements: toitSection.statements.map((toitStatement) =>
      docStatementFrom(toitStatement)
    ),
  };
}

function docFrom(toitDoc: ToitDoc): Doc {
  return toitDoc.map((toitSection) => docSectionFrom(toitSection));
}

function referenceFrom(toitReference: ToitReference): TopLevelItemRef {
  return {
    name: toitReference.name,
    libraryRef: {
      name: toitReference.name,
      path: pathFrom(toitReference.path),
    },
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
    toitdoc: toitField.toitdoc ? docFrom(toitField.toitdoc) : undefined,
    isInherited: toitField.is_inherited,
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
    toitdoc: toitMethod.toitdoc ? docFrom(toitMethod.toitdoc) : undefined,
    shape: toitMethod.shape ? shapeFrom(toitMethod.shape) : undefined,
    isInherited: toitMethod.is_inherited,
  };
}

function classKindFrom(kind: ToitClassKind): ClassKind {
  switch (kind) {
    case TOIT_CLASS_KIND_CLASS:
      return CLASS_KIND_CLASS;
    case TOIT_CLASS_KIND_INTERFACE:
      return CLASS_KIND_INTERFACE;
    case TOIT_CLASS_KIND_MIXIN:
      return CLASS_KIND_MIXIN;
  }
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

  const interfaces = toitClass.interfaces.map((inter, index) =>
    referenceFrom(inter)
  );
  const mixins = toitClass.mixins.map((mixin, index) =>
    referenceFrom(mixin)
  );

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
    kind: classKindFrom(toitClass.kind),
    extends: extend,
    interfaces: interfaces,
    mixins: mixins,
    fields: fields,
    constructors: constructors,
    statics: statics,
    methods: methods,
    toitdoc: toitClass.toitdoc ? docFrom(toitClass.toitdoc) : undefined,
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
    toitdoc: toitGlobal.toitdoc ? docFrom(toitGlobal.toitdoc) : undefined,
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
    toitdoc: toitFunction.toitdoc ? docFrom(toitFunction.toitdoc) : undefined,
    shape: toitFunction.shape ? shapeFrom(toitFunction.shape) : undefined,
    isInherited: false,
  };
}

function categoryFrom(category: ToitCategory): Category {
  switch (category) {
    case TOIT_CATEGORY_FUNDAMENTAL:
      return CATEGORY_FUNDAMENTAL;
    case TOIT_CATEGORY_JUST_THERE:
      return CATEGORY_JUST_THERE;
    case TOIT_CATEGORY_MISC:
      return CATEGORY_MISC;
    case TOIT_CATEGORY_SUB:
      return CATEGORY_SUB;
  }
}

function libraryFromModule(toitModule: ToitModule, path: string[]): Library {
  const name = libraryName(toitModule.name);
  const libraryId = { name: name, path: [...path, name] };

  let classes = {} as Classes;
  let interfaces = {} as Classes;
  let mixins = {} as Classes;
  let exportedClasses = {} as Classes;
  let exportedInterfaces = {} as Classes;
  let exportedMixins = {} as Classes;

  toitModule.classes.forEach((klass, index) => {
    classes = {
      ...classes,
      [klass.name]: classFrom(klass, libraryId, "class", index),
    };
  });
  toitModule.interfaces.forEach((inter, index) => {
    interfaces = {
      ...interfaces,
      [inter.name]: classFrom(inter, libraryId, "class", index),
    };
  });
  toitModule.mixins.forEach((mixin, index) => {
    mixins = {
      ...mixins,
      [mixin.name]: classFrom(mixin, libraryId, "class", index),
    };
  });
  toitModule.export_classes.forEach((klass, index) => {
    exportedClasses = {
      ...exportedClasses,
      [klass.name]: classFrom(klass, libraryId, "exported_class", index),
    };
  });
  toitModule.export_interfaces.forEach((inter, index) => {
    exportedInterfaces = {
      ...exportedInterfaces,
      [inter.name]: classFrom(inter, libraryId, "exported_class", index),
    };
  });
  toitModule.export_mixins.forEach((mixin, index) => {
    exportedMixins = {
      ...exportedMixins,
      [mixin.name]: classFrom(mixin, libraryId, "exported_class", index),
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
    interfaces: interfaces,
    mixins: mixins,
    exportedClasses: exportedClasses,
    exportedInterfaces: exportedInterfaces,
    exportedMixins: exportedMixins,
    globals: globals,
    exportedGlobals: exportedGlobals,
    functions: functions,
    exportedFunctions: exportedFunctions,
    toitdoc: toitModule.toitdoc ? docFrom(toitModule.toitdoc) : undefined,
    category: categoryFrom(toitModule.category),
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
    interfaces: { ...library.interfaces, ...otherLibrary.interfaces },
    mixins: { ...library.mixins, ...otherLibrary.mixins },
    exportedClasses: {
      ...library.exportedClasses,
      ...otherLibrary.exportedClasses,
    },
    exportedInterfaces: {
      ...library.exportedInterfaces,
      ...otherLibrary.exportedInterfaces,
    },
    exportedMixins: {
      ...library.exportedMixins,
      ...otherLibrary.exportedMixins
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
    // TODO(florian): we currently just pick the toitdoc of the first
    // library.
    toitdoc: library.toitdoc || otherLibrary.toitdoc,
    // TODO(florian): we currently just pick the category of the first
    // library.
    category: library.category,
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
    interfaces: libraryContent ? libraryContent.interfaces : {},
    mixins: libraryContent ? libraryContent.mixins : {},
    exportedClasses: libraryContent ? libraryContent.exportedClasses : {},
    exportedInterfaces: libraryContent ? libraryContent.exportedInterfaces : {},
    exportedMixins: libraryContent ? libraryContent.exportedMixins : {},
    globals: libraryContent ? libraryContent.globals : [],
    exportedGlobals: libraryContent ? libraryContent.exportedGlobals : [],
    functions: libraryContent ? libraryContent.functions : [],
    exportedFunctions: libraryContent ? libraryContent.exportedFunctions : [],
    toitdoc: libraryContent ? libraryContent.toitdoc : undefined,
    category: categoryFrom(toitLibrary.category),
  };
}

function appendToIDPath(lib: Library, prefix: string): void {
  lib.id.path.unshift(prefix);
  for (const name in lib.libraries) {
    appendToIDPath(lib.libraries[name], prefix);
  }
}

function foldLibrary(topLibrary: Library, subLibrary: Library): void {
  if (topLibrary.libraries[subLibrary.name]) {
    console.log(
      "name clash when re-order libraries in package mode",
      subLibrary.name
    );
  }
  topLibrary.libraries[subLibrary.name] = subLibrary;
  appendToIDPath(subLibrary, topLibrary.name);
}

export function modelFrom(
  rootLibrary: ToitLibrary,
  viewMode: ViewMode,
  packageName: string
): Libraries {
  let model = libraryFromLibrary(rootLibrary, [], true).libraries;

  // In package mode if we have more libraries top level, we will re-order the libraries.
  // Such that the library named the same as the package will be the top-level library.
  if (viewMode === ViewMode.Package) {
    // @TODO(jesper): Changing the toitdoc generator to know of package names would make it
    //                possible to change it there instead.
    //                That way import/module logic would be encapsuled in the compiler.
    let rootLibrary = model[packageName];
    if (rootLibrary === undefined) {
      // This is the case of unstructure mode. here we make a fake rootLibrary and fold all
      // top-libraries under that rootLibrary.
      rootLibrary = {
        name: packageName,
        id: { name: packageName, path: [packageName] },
        libraries: {},
        classes: {},
        interfaces: {},
        mixins: {},
        exportedClasses: {},
        exportedInterfaces: {},
        exportedMixins: {},
        globals: [],
        exportedGlobals: [],
        functions: [],
        exportedFunctions: [],
        toitdoc: [],
        category: "misc",
      };
    }
    const topLibraries = Object.keys(model);
    topLibraries.forEach((name) => {
      if (name === packageName) {
        return;
      }
      foldLibrary(rootLibrary, model[name]);
      if (rootLibrary.libraries[name]) {
        console.log("name clash when re-order libraries in package mode", name);
      }
    });
    model = { [packageName]: rootLibrary };
  }
  return model;
}
