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

export type ToitMode = "sdk" | "package";

export interface ToitObject {
  sdk_version: string;
  version?: string;
  pkg_name?: string;
  sdk_path?: string[];
  packages_path?: string[];
  package_names?: { [key: string]: string };
  contains_pkgs?: boolean;
  contains_sdk?: boolean;
  mode?: ToitMode;
  libraries: ToitLibraries;
}

export const TOIT_CATEGORY_FUNDAMENTAL = "fundamental";
export const TOIT_CATEGORY_JUST_THERE = "just_there";
export const TOIT_CATEGORY_MISC = "misc";
export const TOIT_CATEGORY_SUB = "sub";

export type ToitCategory =
  | typeof TOIT_CATEGORY_FUNDAMENTAL
  | typeof TOIT_CATEGORY_JUST_THERE
  | typeof TOIT_CATEGORY_MISC
  | typeof TOIT_CATEGORY_SUB;

export const TOIT_CLASS_KIND_CLASS = "class";
export const TOIT_CLASS_KIND_INTERFACE = "interface";
export const TOIT_CLASS_KIND_MIXIN = "mixin";

export type ToitClassKind =
  | typeof TOIT_CLASS_KIND_CLASS
  | typeof TOIT_CLASS_KIND_INTERFACE
  | typeof TOIT_CLASS_KIND_MIXIN;

export interface ToitLibrary {
  object_type: typeof OBJECT_TYPE_LIBRARY;
  modules: ToitModules;
  path: string[];
  libraries: ToitLibraries;
  name: string;
  category: ToitCategory;
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
  interfaces: ToitClass[];
  mixins: ToitClass[];
  export_classes: ToitClass[];
  export_interfaces: ToitClass[];
  export_mixins: ToitClass[];
  globals: ToitGlobal[];
  export_globals: ToitGlobal[];
  functions: ToitFunction[];
  export_functions: ToitFunction[];
  toitdoc?: ToitDoc;
  category: ToitCategory;
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
  kind: ToitClassKind;
  toitdoc: ToitDoc | null;
  structure: ToitStructure;
  extends: ToitReference;
  interfaces: ToitReference[];
  mixins: ToitReference[];
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
