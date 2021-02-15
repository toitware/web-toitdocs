import {
  OBJECT_TYPE_SECTION,
  OBJECT_TYPE_EXPRESSION_CODE,
  OBJECT_TYPE_EXPRESSION_TEXT,
  OBJECT_TYPE_STATEMENT_CODE_SECTION,
  OBJECT_TYPE_STATEMENT_ITEM,
  OBJECT_TYPE_STATEMENT_ITEMIZED,
  OBJECT_TYPE_STATEMENT_PARAGRAPH,
  OBJECT_TYPE_TOITDOCREF,
} from "../generator/sdk";
import { ClassMemberRef, TopLevelItemRef, TopLevelRef } from "./reference";

export type Modules = { [moduleName: string]: Module };
export type Classes = { [className: string]: Class };

export interface Module {
  name: string;
  id: TopLevelRef;
  modules: Modules;
  classes: Classes;
  exportedClasses: Classes;
  globals: Global[];
  exportedGlobals: Global[];
  functions: Function[];
  exportedFunctions: Function[];
}

export interface Class {
  name: string;
  id: TopLevelItemRef;
  extends?: TopLevelItemRef;
  fields: Field[];
  constructors: Method[];
  statics: Method[];
  methods: Method[];
  toitdoc: Doc;
}

export interface Global {
  name: string;
  id: TopLevelItemRef;
  toitdoc: Doc;
}

export interface Function {
  name: string;
  id: TopLevelItemRef;
  parameters: Parameter[];
  returnType: Type;
  toitdoc: Doc;
}

export interface Method {
  name: string;
  id: ClassMemberRef;
  parameters: Parameter[];
  returnType: Type;
  toitdoc: Doc;
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
  toitdoc: Doc;
}

export interface Type {
  isNone: boolean;
  isAny: boolean;
  isBlock: boolean;
  reference?: TopLevelItemRef;
}

// Toitdoc related

export type Doc = DocSection[];

export interface DocSection {
  object_type: typeof OBJECT_TYPE_SECTION;
  title: string | null;
  statements: DocStatement[];
}

export type DocStatement =
  | DocStatementParagraph
  | DocStatementItemized
  | DocStatementCodeSection;

export interface DocStatementItemized {
  object_type: typeof OBJECT_TYPE_STATEMENT_ITEMIZED;
  items: DocStatementItem[];
}

export interface DocStatementItem {
  object_type: typeof OBJECT_TYPE_STATEMENT_ITEM;
  statements: DocStatement[];
}

export interface DocStatementCodeSection {
  object_type: typeof OBJECT_TYPE_STATEMENT_CODE_SECTION;
  text: string;
}

export interface DocStatementParagraph {
  object_type: typeof OBJECT_TYPE_STATEMENT_PARAGRAPH;
  expressions: DocExpression[];
}

export type DocExpression = DocExpressionCode | DocExpressionText | DocRef;

export interface DocExpressionCode {
  object_type: typeof OBJECT_TYPE_EXPRESSION_CODE;
  text: string;
}

export interface DocExpressionText {
  object_type: typeof OBJECT_TYPE_EXPRESSION_TEXT;
  text: string;
}

export interface DocRef {
  object_type: typeof OBJECT_TYPE_TOITDOCREF;
  text: string;
}
