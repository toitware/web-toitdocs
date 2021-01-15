// Used for referencing modules
export interface ModuleRef {
  name: string;
  path: string[];
}

// Used for referencing elements on modules, e.g. classes, globals and functions
export interface ModuleItemRef {
  name: string;
  path: string[];
  type?: ModuleItemType;
  offset?: number;
}

// Used for referencing elements on classes or interfaces, e.g. fields, methods, constructors, statics, ...
export interface LocalRef {
  name: string;
  path: string[];
  classOffset: number;
  type: LocalType;
  offset: number;
}

export type ModuleItemType =
  | "class"
  | "exported_class"
  | "global"
  | "exported_global"
  | "function"
  | "exported_function";

export type LocalType = "field" | "method" | "constructor" | "static";
