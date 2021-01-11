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
  is_private?: boolean;
}

export interface ToitClass {
  object_type: typeof OBJECT_TYPE_CLASS;
  name: string;
  toitdoc: ToitDoc;
  structure: ToitStructure;
  extends: ToitReference;
  is_private?: boolean;
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
  is_private?: boolean;
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
