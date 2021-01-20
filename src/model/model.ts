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
  title: string | null;
  statements: DocStatement[];
}

export type DocStatement =
  | DocStatementParagraph
  | DocStatementItemized
  | DocStatementCode;

export interface DocStatementItemized {
  items: DocStatementItem[];
}

export interface DocStatementItem {
  statements: DocStatement[];
}

export interface DocStatementCode {
  text: string;
}

export interface DocStatementParagraph {
  expressions: DocExpression[];
}

export type DocExpression = DocStatementCode | DocRef;

export interface DocRef {
  text: string;
}
