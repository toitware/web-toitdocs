import {
  ClassMemberRef,
  LinkRef,
  TopLevelItemRef,
  TopLevelRef,
} from "./reference";

export type Libraries = { [libraryName: string]: Library };
export type Classes = { [className: string]: Class };

export const CATEGORY_FUNDAMENTAL = "fundamental";
export const CATEGORY_JUST_THERE = "just_there";
export const CATEGORY_MISC = "misc";
export const CATEGORY_SUB = "sub";

export type Category =
  | typeof CATEGORY_FUNDAMENTAL
  | typeof CATEGORY_JUST_THERE
  | typeof CATEGORY_MISC
  | typeof CATEGORY_SUB;

export const CLASS_KIND_CLASS = "class";
export const CLASS_KIND_INTERFACE = "interface";
export const CLASS_KIND_MIXIN = "mixin";

export type ClassKind =
  | typeof CLASS_KIND_CLASS
  | typeof CLASS_KIND_INTERFACE
  | typeof CLASS_KIND_MIXIN;

export interface Library {
  name: string;
  id: TopLevelRef;
  libraries: Libraries;
  classes: Classes;
  interfaces: Classes;
  mixins: Classes;
  exportedClasses: Classes;
  exportedInterfaces: Classes;
  exportedMixins: Classes;
  globals: Global[];
  exportedGlobals: Global[];
  functions: Function[];
  exportedFunctions: Function[];
  toitdoc?: Doc;
  category: Category;
}

export interface Class {
  name: string;
  id: TopLevelItemRef;
  kind: ClassKind;
  extends?: TopLevelItemRef;
  interfaces: TopLevelItemRef[];
  mixins: TopLevelItemRef[];
  fields: Field[];
  constructors: Method[];
  statics: Method[];
  methods: Method[];
  toitdoc?: Doc;
}

export interface Global {
  name: string;
  id: TopLevelItemRef;
  toitdoc?: Doc;
}

export interface Function {
  name: string;
  id: TopLevelItemRef;
  parameters: Parameter[];
  returnType: Type;
  toitdoc?: Doc;
  shape?: Shape;
  isInherited: boolean;
}

export interface Method {
  name: string;
  id: ClassMemberRef;
  parameters: Parameter[];
  returnType: Type;
  toitdoc?: Doc;
  shape?: Shape;
  isInherited: boolean;
}

export interface Parameter {
  name: string;
  isBlock: boolean;
  isNamed: boolean;
  isRequired: boolean;
  type: Type;
}

export interface Field {
  name: string;
  id: ClassMemberRef;
  type: Type;
  toitdoc?: Doc;
  isInherited: boolean;
}

export interface Type {
  isNone: boolean;
  isAny: boolean;
  isBlock: boolean;
  reference?: TopLevelItemRef;
}

export interface Shape {
  arity: number;
  totalBlockCount: number;
  namedBlockCount: number;
  names: string[];
}

// Toitdoc related

export const DOC_STATEMENT_PARAGRAPH = "DOC_STATEMENT_PARAGRAPH";
export const DOC_STATEMENT_ITEMIZED = "DOC_STATEMENT_ITEMIZED";
export const DOC_STATEMENT_ITEM = "DOC_STATEMENT_ITEM";
export const DOC_STATEMENT_CODE_SECTION = "DOC_STATEMENT_CODE_SECTION";
export const DOC_EXPRESSION_CODE = "DOC_EXPRESSION_CODE";
export const DOC_EXPRESSION_TEXT = "DOC_EXPRESSION_TEXT";
export const DOC_DOCREF = "DOC_DOCREF";

export type Doc = DocSection[];

export interface DocSection {
  title: string | null;
  statements: DocStatement[];
}

export type DocStatement =
  | DocStatementParagraph
  | DocStatementItemized
  | DocStatementCodeSection;

export interface DocStatementItemized {
  type: typeof DOC_STATEMENT_ITEMIZED;
  items: DocStatementItem[];
}

export interface DocStatementItem {
  type: typeof DOC_STATEMENT_ITEM;
  statements: DocStatement[];
}

export interface DocStatementCodeSection {
  type: typeof DOC_STATEMENT_CODE_SECTION;
  text: string;
}

export interface DocStatementParagraph {
  type: typeof DOC_STATEMENT_PARAGRAPH;
  expressions: DocExpression[];
}

export type DocExpression = DocExpressionCode | DocExpressionText | DocRef;

export interface DocExpressionCode {
  type: typeof DOC_EXPRESSION_CODE;
  text: string;
}

export interface DocExpressionText {
  type: typeof DOC_EXPRESSION_TEXT;
  text: string;
}

export interface DocRef {
  type: typeof DOC_DOCREF;
  text: string;
  reference: LinkRef;
}
