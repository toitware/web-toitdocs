import { ToitDoc } from "../generator/sdk";
import { LocalRef, ModuleItemRef, ModuleRef } from "./reference";

export type Modules = { [moduleName: string]: Module };
export type Classes = { [className: string]: Class };

export interface Module {
  name: string;
  id: ModuleRef;
  modules: Modules;
  classes: { [className: string]: Class };
  exportedClasses: { [className: string]: Class };
  globals: Global[];
  exportedGlobals: Global[];
  functions: Function[];
  exportedFunctions: Function[];
}

export interface Class {
  name: string;
  id: ModuleItemRef;
  extends?: ModuleItemRef;
  fields: Field[];
  constructors: Method[];
  statics: Method[];
  methods: Method[];
  toitdoc: ToitDoc; // TODO (rikke): Change this...
}

export interface Global {
  name: string;
  id: ModuleItemRef;
  toitdoc: ToitDoc; // TODO (rikke): Change this...
}

export interface Function {
  name: string;
  id: ModuleItemRef;
  parameters: Parameter[];
  returnType: Type;
  toitdoc: ToitDoc; // TODO (rikke): Change this...
}

export interface Method {
  name: string;
  id: LocalRef;
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
  id: LocalRef;
  type: Type;
  toitdoc: ToitDoc;
}

export interface Type {
  isNone: boolean;
  isAny: boolean;
  isBlock: boolean;
  reference?: ModuleItemRef;
}
