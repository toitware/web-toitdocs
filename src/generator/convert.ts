import { containsPkgs, containsSdk } from "../App";
import {
  CATEGORY_FUNDAMENTAL,
  CATEGORY_JUST_THERE,
  CATEGORY_MISC,
  CATEGORY_SUB,
  CLASS_KIND_CLASS,
  CLASS_KIND_INTERFACE,
  CLASS_KIND_MIXIN,
  Category,
  Class,
  ClassKind,
  Classes,
  DOC_DOCREF,
  DOC_EXPRESSION_CODE,
  DOC_EXPRESSION_LINK,
  DOC_EXPRESSION_TEXT,
  DOC_STATEMENT_CODE_SECTION,
  DOC_STATEMENT_ITEM,
  DOC_STATEMENT_ITEMIZED,
  DOC_STATEMENT_PARAGRAPH,
  Doc,
  DocExpression,
  DocSection,
  DocStatement,
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
  OBJECT_TYPE_EXPRESSION_LINK,
  OBJECT_TYPE_EXPRESSION_TEXT,
  OBJECT_TYPE_STATEMENT_CODE_SECTION,
  OBJECT_TYPE_STATEMENT_ITEMIZED,
  OBJECT_TYPE_STATEMENT_PARAGRAPH,
  OBJECT_TYPE_TOITDOCREF,
  TOIT_CATEGORY_FUNDAMENTAL,
  TOIT_CATEGORY_JUST_THERE,
  TOIT_CATEGORY_MISC,
  TOIT_CATEGORY_SUB,
  TOIT_CLASS_KIND_CLASS,
  TOIT_CLASS_KIND_INTERFACE,
  TOIT_CLASS_KIND_MIXIN,
  ToitCategory,
  ToitClass,
  ToitClassKind,
  ToitDoc,
  ToitDocRef,
  ToitDocRefKind,
  ToitExpression,
  ToitField,
  ToitFunction,
  ToitGlobal,
  ToitLibraries,
  ToitLibrary,
  ToitModule,
  ToitParameter,
  ToitReference,
  ToitSection,
  ToitShape,
  ToitStatement,
  ToitType,
} from "./doc";

// Slightly hackish: we keep a few global variables, so we don't need to
// pass them around everywhere.
// TODO(florian): move all the conversion functions into a class and store the state there.
let sdkPath: string[] | undefined = undefined;
let packagesPath: string[] | undefined = undefined;
let packageNames: { [name: string]: string } | undefined = undefined;

const SDK_LIBS_URL = "https://libs.toit.io";
const PACKAGES_URL = "https://pkg.toit.io";

function libraryName(name: string): string {
  return name.endsWith(".toit") ? name.substring(0, name.length - 5) : name;
}

type UrlAndPath = {
  url: string;
  path: string[];
};

function isSdkPath(path: string[]): boolean {
  if (sdkPath === undefined) {
    return false;
  }
  if (path.length < sdkPath.length) {
    return false;
  }
  for (let i = 0; i < sdkPath.length; i++) {
    if (path[i] !== sdkPath[i]) {
      return false;
    }
  }
  return true;
}

function isPackagePath(path: string[]): boolean {
  if (packagesPath === undefined) {
    return false;
  }
  if (path.length < packagesPath.length) {
    return false;
  }
  for (let i = 0; i < packagesPath.length; i++) {
    if (path[i] !== packagesPath[i]) {
      return false;
    }
  }
  return true;
}

function buildPackageUrlAndPath(path: string[]): UrlAndPath {
  // Example path:
  // [".packages", "github.com", "toitware", "toit-morse", "1.0.6", "src", "morse.toit"]
  // We need to drop the ".packages" (done by the slice below).
  // The ID of the package is everything before the version number.
  // The version number is always prefixed by "src".
  // Note: a valid source can't have dots in the name. This means that anything of the form
  // X.Y.Z can't be part of the source path.
  let srcIndex = packagesPath!.length;
  while (true) {
    srcIndex = path.indexOf("src", srcIndex);
    if (srcIndex === -1) {
      break;
    }
    if (srcIndex >= 1 && /^\d+\.\d+\.\d+$/.exec(path[srcIndex - 1])) {
      break;
    }
    srcIndex++;
  }
  if (srcIndex === -1) {
    // No "src" in the path.
    return {
      url: "",
      path: path,
    };
  }
  const versionNumber = path[srcIndex - 1];
  const packageIdSegments = path.slice(packagesPath!.length, srcIndex - 1);
  const packageId = packageIdSegments.join("/");
  const packageName = packageNames![packageId];
  const nestedPath = path.slice(srcIndex + 1);
  nestedPath.unshift(packageName);

  if (packageName === undefined) {
    // Not a package we know about.
    return {
      url: "",
      path: path,
    };
  }

  const url = PACKAGES_URL + "/" + packageId + "@" + versionNumber + "/docs";

  return {
    url: url,
    path: nestedPath,
  };
}

function urlAndPathFrom(path: string[]): UrlAndPath {
  path = path.slice(); // Make a copy.
  let url = "";
  if (path.length > 0) {
    if (!containsSdk && isSdkPath(path)) {
      url = SDK_LIBS_URL;
      path = path.slice(sdkPath!.length + 1); // Also drop the 'lib'.
    } else if (!containsPkgs && isPackagePath(path)) {
      const urlPath = buildPackageUrlAndPath(path);
      url = urlPath.url;
      // We don't return immediately so we can manipulate the path below.
      path = urlPath.path;
    } else {
      // Nothing to do.
    }
  }
  const len = path.length;
  if (len === 0) {
    return {
      url: url,
      path: path,
    };
  }
  path[len - 1] = libraryName(path[len - 1]);
  if (len === 1) {
    return {
      url: url,
      path: path,
    };
  }
  if (path[len - 1] === path[len - 2]) {
    // Something like lib/net/net.toit.
    // In that case the net.toit is presented as 'lib.net' (as this is how it would
    // be imported).
    path.length--;
  }
  return {
    url: url,
    path: path,
  };
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
    case "parameter":
      return "parameter";
    default:
      console.error("Unknown ToitDocRefKind", toitDocRefKind);
      return "unknown";
  }
}

function linkRefFrom(toitDocRef: ToitDocRef): LinkRef {
  let url = "";
  let path = [] as string[];
  if (toitDocRef.path) {
    const urlPath = urlAndPathFrom(toitDocRef.path);
    url = urlPath.url;
    path = urlPath.path;
  }

  return {
    kind: linkRefKindFrom(toitDocRef.kind),
    baseUrl: url,
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
    case OBJECT_TYPE_EXPRESSION_LINK:
      return {
        type: DOC_EXPRESSION_LINK,
        text: toitExpression.text,
        url: toitExpression.url,
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
    level: toitSection.level,
    statements: toitSection.statements.map((toitStatement) =>
      docStatementFrom(toitStatement)
    ),
  };
}

function docFrom(toitDoc: ToitDoc): Doc {
  return toitDoc.map((toitSection) => docSectionFrom(toitSection));
}

function referenceFrom(toitReference: ToitReference): TopLevelItemRef {
  const urlPath = urlAndPathFrom(toitReference.path);
  return {
    name: toitReference.name,
    libraryRef: {
      name: toitReference.name,
      baseUrl: urlPath.url,
      path: urlPath.path,
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
    defaultValue: toitParameter.default_value,
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
  const mixins = toitClass.mixins.map((mixin, index) => referenceFrom(mixin));

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
  const libraryId = { name: name, baseUrl: "", path: [...path, name] };

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
      ...otherLibrary.exportedMixins,
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

/* eslint @typescript-eslint/no-use-before-define: "off" */
function libraryFromLibrary(
  toitLibrary: ToitLibrary,
  path: string[],
  root?: boolean
): Library {
  const name = toitLibrary.name;
  const libraryPath = root ? [] : [...path, name];

  let libraries = librariesFromLibraries(toitLibrary.libraries, libraryPath);
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
    id: { name: name, baseUrl: "", path: libraryPath },
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

function librariesFromLibraries(
  toitLibraries: ToitLibraries,
  path: string[]
): Libraries {
  let libraries = {} as Libraries;

  Object.values(toitLibraries).forEach((toitLibrary) => {
    if (libraries[toitLibrary.name]) {
      console.log("Name clash", toitLibrary.name);
    }
    libraries = {
      ...libraries,
      [toitLibrary.name]: libraryFromLibrary(toitLibrary, path),
    };
  });

  return libraries;
}

export function modelFrom(
  libraries: ToitLibraries,
  generatorSdkPath: string[] | undefined,
  generatorPackagesPath: string[] | undefined,
  generatorPackageNames: { [name: string]: string } | undefined
): Libraries {
  sdkPath = generatorSdkPath;
  packagesPath = generatorPackagesPath;
  packageNames = generatorPackageNames;

  return librariesFromLibraries(libraries, []);
}
