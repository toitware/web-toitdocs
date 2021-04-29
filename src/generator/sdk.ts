export const OBJECT_TYPE_SECTION = "section";
export const OBJECT_TYPE_STATEMENT_CODE_SECTION = "statement_code_section";
export const OBJECT_TYPE_STATEMENT_ITEMIZED = "statement_itemized";
export const OBJECT_TYPE_STATEMENT_ITEM = "statement_item";
export const OBJECT_TYPE_STATEMENT_PARAGRAPH = "statement_paragraph";
export const OBJECT_TYPE_EXPRESSION_CODE = "expression_code";
export const OBJECT_TYPE_EXPRESSION_TEXT = "expression_text";
export const OBJECT_TYPE_TOITDOCREF = "toitdocref";
export const OBJECT_TYPE_FUNCTION = "function";
export const OBJECT_TYPE_PARAMETER = "parameter";
export const OBJECT_TYPE_FIELD = "field";
export const OBJECT_TYPE_CLASS = "class";
export const OBJECT_TYPE_MODULE = "module";
export const OBJECT_TYPE_GLOBAL = "global";
export const OBJECT_TYPE_LIBRARY = "library";
export const OBJECT_TYPE_EXPRESSION = "expression";
export const OBJECT_TYPE_SHAPE = "shape";

export type ObjectTypeExpression =
  | typeof OBJECT_TYPE_EXPRESSION_CODE
  | typeof OBJECT_TYPE_EXPRESSION_TEXT
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
  // TODO(florian): interfaces (and export_interfaces) should not be optional.
  // They currently are, as they were added at a later point in time.
  interfaces?: ToitClass[];
  export_classes: ToitClass[];
  export_interfaces?: ToitClass[];
  globals: ToitGlobal[];
  export_globals: ToitGlobal[];
  functions: ToitFunction[];
  export_functions: ToitFunction[];
  toitdoc?: ToitDoc;
}

export interface ToitModules {
  [moduleName: string]: ToitModule;
}

export interface ToitGlobal {
  object_type: typeof OBJECT_TYPE_GLOBAL;
  name: string;
  toitdoc: ToitDoc | null;
}

export interface ToitFunction {
  object_type: typeof OBJECT_TYPE_FUNCTION;
  name: string;
  parameters: ToitParameter[];
  return_type: ToitType;
  toitdoc: ToitDoc | null;
  shape?: ToitShape;
  is_inherited: boolean;
}

export interface ToitClass {
  object_type: typeof OBJECT_TYPE_CLASS;
  name: string;
  // TODO(florian): is_interface should not be optional.
  // It is marked as such as the field was added at a later point in time.
  is_interface?: boolean;
  toitdoc: ToitDoc | null;
  structure: ToitStructure;
  extends: ToitReference;
  interfaces: ToitReference[];
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
  toitdoc: ToitDoc | null;
  is_inherited: boolean;
}

export interface ToitShape {
  object_type: typeof OBJECT_TYPE_SHAPE;
  arity: number;
  total_block_count: number;
  named_block_count: number;
  names: string[];
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
  | ToitExpressionCode
  | ToitExpressionText
  | ToitDocRef;

export interface ToitExpressionCode {
  object_type: typeof OBJECT_TYPE_EXPRESSION_CODE;
  text: string;
}

export interface ToitExpressionText {
  object_type: typeof OBJECT_TYPE_EXPRESSION_TEXT;
  text: string;
}

export type ToitDocRefKind =
  | "other"
  | "class"
  | "global"
  | "global-method"
  | "static-method"
  | "constructor"
  | "factory"
  | "method"
  | "field"
  | "";

export interface ToitDocRef {
  object_type: typeof OBJECT_TYPE_TOITDOCREF;
  kind: ToitDocRefKind;
  text: string;
  path: string[] | null;
  holder: string | null;
  name: string;
  shape: ToitShape | null;
}
