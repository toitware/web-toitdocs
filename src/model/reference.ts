// Used for referencing modules
export interface TopLevelRef {
  name: string;
  path: string[];
}

// Used for referencing elements on modules, e.g. classes, globals and functions
export interface TopLevelItemRef {
  name: string;
  path: string[];
  type?: TopLevelItemType;
  offset?: number;
}

// Used for referencing elements on classes or interfaces, e.g. fields, methods, constructors, statics, ...
export interface ClassMemberRef {
  name: string;
  path: string[];
  classOffset: number;
  type: ClassMemberType;
  offset: number;
}

export type TopLevelItemType =
  | "class"
  | "exported_class"
  | "global"
  | "exported_global"
  | "function"
  | "exported_function";

export type ClassMemberType = "field" | "method" | "constructor" | "static";
