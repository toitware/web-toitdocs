import {
  ObjectTypeExpression,
  ObjectTypeStatement,
  OBJECT_TYPE_CLASS,
  OBJECT_TYPE_FIELD,
  OBJECT_TYPE_FUNCTION,
  OBJECT_TYPE_GLOBAL,
  OBJECT_TYPE_LIBRARY,
  OBJECT_TYPE_MODULE,
  OBJECT_TYPE_PARAMETER,
  OBJECT_TYPE_SECTION,
  OBJECT_TYPE_STATEMENT_CODE,
  OBJECT_TYPE_STATEMENT_CODE_SECTION,
  OBJECT_TYPE_STATEMENT_ITEM,
  OBJECT_TYPE_STATEMENT_ITEMIZED,
  OBJECT_TYPE_STATEMENT_PARAGRAPH,
  OBJECT_TYPE_TOITDOCREF,
} from "../sdk";

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

export interface ToitSection {
  object_type: typeof OBJECT_TYPE_SECTION;
  title: string | null;
  statements: ToitStatement[];
}

export interface ToitStatement {
  object_type: ObjectTypeStatement | ObjectTypeExpression;
}

export interface ToitStatementParagraph {
  object_type: typeof OBJECT_TYPE_STATEMENT_PARAGRAPH;
  expressions: ToitExpression[];
}

export interface ToitStatementItemized {
  object_type: typeof OBJECT_TYPE_STATEMENT_ITEMIZED;
  items: ToitStatementItem[];
}

export interface ToitStatementItem {
  object_type: typeof OBJECT_TYPE_STATEMENT_ITEM;
  statements: ToitStatement[];
}

export interface ToitStatementCode {
  object_type: typeof OBJECT_TYPE_STATEMENT_CODE;
  text: string;
}

export interface ToitStatementCodeSection {
  object_type: typeof OBJECT_TYPE_STATEMENT_CODE_SECTION;
  text: string;
}

export interface ToitExpression {
  object_type: ObjectTypeExpression;
  text: string;
}

export interface ToitDocRef {
  object_type: typeof OBJECT_TYPE_TOITDOCREF;
  text: string;
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

export interface ToitFunctions {
  [functionName: string]: ToitFunction;
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

export type ToitDoc = ToitSection[];
