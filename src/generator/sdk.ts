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
import { LocalType, ModuleItemRef, ModuleItemType } from "../model/reference";

export const OBJECT_TYPE_SECTION = "section";
export const OBJECT_TYPE_STATEMENT_CODE_SECTION = "statement_code_section";
export const OBJECT_TYPE_STATEMENT_ITEMIZED = "statement_itemized";
export const OBJECT_TYPE_STATEMENT_ITEM = "statement_item";
export const OBJECT_TYPE_STATEMENT_PARAGRAPH = "statement_paragraph";
export const OBJECT_TYPE_STATEMENT_CODE = "statement_code";
export const OBJECT_TYPE_STATEMENT_TEXT = "statement_text";
export const OBJECT_TYPE_TOITDOCREF = "toitdocref";
export const OBJECT_TYPE_FUNCTION = "function";
export const OBJECT_TYPE_PARAMETER = "parameter";
export const OBJECT_TYPE_FIELD = "field";
export const OBJECT_TYPE_CLASS = "class";
export const OBJECT_TYPE_MODULE = "module";
export const OBJECT_TYPE_GLOBAL = "global";
export const OBJECT_TYPE_LIBRARY = "library";
export const OBJECT_TYPE_EXPRESSION = "expression";

export type ObjectTypeExpression =
  | typeof OBJECT_TYPE_STATEMENT_CODE
  | typeof OBJECT_TYPE_STATEMENT_CODE_SECTION
  | typeof OBJECT_TYPE_TOITDOCREF;

export interface ToitObject {
  sdk_version: string;
  libraries: ToitLibraries;
}

export interface ToitLibrary {
  object_type: typeof OBJECT_TYPE_LIBRARY;
  modules: ToitModules;
  path: string[];
  libraries: ToitLibraries;
  name: string;
}

export interface ToitLibraries {
  [libraryName: string]: ToitLibrary;
}

export interface ToitType {
  object_type: "reference";
  is_none: boolean;
  is_any: boolean;
  is_block: boolean;
  reference: ToitReference;
}

export interface ToitParameter {
  object_type: typeof OBJECT_TYPE_PARAMETER;
  name: string;
  is_block: boolean;
  is_named: boolean;
  is_required: boolean;
  type: ToitType;
}

export interface ToitReference {
  object_type: "reference";
  name: string;
  path: string[];
}

export interface ToitModule {
  object_type: typeof OBJECT_TYPE_MODULE;
  name: string;
  classes: ToitClass[];
  export_classes: ToitClass[];
  globals: ToitGlobal[];
  export_globals: ToitGlobal[];
  functions: ToitFunction[];
  export_functions: ToitFunction[];
}

export interface ToitModules {
  [moduleName: string]: ToitModule;
}

export interface ToitGlobal {
  object_type: typeof OBJECT_TYPE_GLOBAL;
  name: string;
  toitdoc: ToitDoc;
}

export interface ToitFunction {
  object_type: typeof OBJECT_TYPE_FUNCTION;
  name: string;
  parameters: ToitParameter[];
  return_type: ToitType;
  toitdoc: ToitDoc;
}

export interface ToitClass {
  object_type: typeof OBJECT_TYPE_CLASS;
  name: string;
  toitdoc: ToitDoc;
  structure: ToitStructure;
  extends: ToitReference;
}

export interface ToitStructure {
  statics: ToitFunction[];
  constructors: ToitFunction[];
  factories: ToitFunction[];
  fields: ToitField[];
  methods: ToitFunction[];
}

export interface ToitField {
  object_type: typeof OBJECT_TYPE_FIELD;
  name: string;
  type: ToitType;
  toitdoc: ToitDoc;
}

// ToitDoc related

export type ToitDoc = ToitSection[];

export interface ToitSection {
  object_type: typeof OBJECT_TYPE_SECTION;
  title: string | null;
  statements: ToitStatement[];
}

export type ToitStatement =
  | ToitStatementParagraph
  | ToitStatementItemized
  | ToitStatementCodeSection;

export interface ToitStatementItemized {
  object_type: typeof OBJECT_TYPE_STATEMENT_ITEMIZED;
  items: ToitStatementItem[];
}

export interface ToitStatementItem {
  object_type: typeof OBJECT_TYPE_STATEMENT_ITEM;
  statements: ToitStatement[];
}

export interface ToitStatementCodeSection {
  object_type: typeof OBJECT_TYPE_STATEMENT_CODE_SECTION;
  text: string;
}

export interface ToitStatementParagraph {
  object_type: typeof OBJECT_TYPE_STATEMENT_PARAGRAPH;
  expressions: ToitExpression[];
}

export type ToitExpression =
  | ToitStatementCode
  | ToitStatementCodeSection
  | ToitDocRef;

export interface ToitStatementCode {
  object_type: typeof OBJECT_TYPE_STATEMENT_CODE;
  text: string;
}

export interface ToitDocRef {
  object_type: typeof OBJECT_TYPE_TOITDOCREF;
  text: string;
}

// Convert from generated json to model

function moduleName(name: string): string {
  return name.endsWith(".toit") ? name.substring(0, name.length - 5) : name;
}

function referenceFrom(toitReference: ToitReference): ModuleItemRef {
  const path = toitReference.path.map((s) => moduleName(s));
  path.shift(); // Get rid of first "lib" entry.

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
  type: LocalType,
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
  type: ModuleItemType,
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
  type: ModuleItemType,
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
  type: ModuleItemType,
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
