import { ToitDoc } from "../generator/sdk";
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
  toitdoc: ToitDoc; // TODO (rikke): Change this...
}

export interface Global {
  name: string;
  id: TopLevelItemRef;
  toitdoc: ToitDoc; // TODO (rikke): Change this...
}

export interface Function {
  name: string;
  id: TopLevelItemRef;
  parameters: Parameter[];
  returnType: Type;
  toitdoc: ToitDoc; // TODO (rikke): Change this...
}

export interface Method {
  name: string;
  id: ClassMemberRef;
  parameters: Parameter[];
  returnType: Type;
  toitdoc: ToitDoc; // TODO (rikke): Change this...
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
  toitdoc: ToitDoc;
}

export interface Type {
  isNone: boolean;
  isAny: boolean;
  isBlock: boolean;
  reference?: TopLevelItemRef;
}
