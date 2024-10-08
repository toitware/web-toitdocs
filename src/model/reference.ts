// Copyright (C) 2024 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import { Shape } from "./model";

// Used for referencing libraries
export interface TopLevelRef {
  name: string;
  baseUrl: string;
  path: string[];
}

// Used for referencing elements on libraries, e.g. classes, globals and functions
export interface TopLevelItemRef {
  name: string;
  libraryRef: TopLevelRef;
  type?: TopLevelItemType;
  offset?: number;
}

// Used for referencing elements on classes or interfaces, e.g. fields, methods, constructors, statics, ...
export interface ClassMemberRef {
  name: string;
  classRef: TopLevelItemRef;
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

export type LinkRefKind =
  | "other"
  | "class"
  | "global"
  | "global-method"
  | "static-method"
  | "constructor"
  | "factory"
  | "method"
  | "field"
  | "parameter"
  | "unknown";

// Contains all the information needed to be able to create a link for something.
export interface LinkRef {
  kind: LinkRefKind;
  baseUrl: string;
  path: string[];
  holder: string;
  name: string;
  shape?: Shape;
}
