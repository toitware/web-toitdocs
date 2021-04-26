// Copyright (C) 2020 Toitware ApS. All rights reserved.

import {
  classUrlFromRef,
  functionUrlFromRef,
  libraryUrlFromRef,
  methodUrlFromRef,
} from "../misc/util";
import {
  Class,
  Function,
  Libraries,
  Library,
  Method,
  Parameter,
  Type,
} from "./model";
import { ClassMemberRef, TopLevelItemRef, TopLevelRef } from "./reference";

function typeString(type: Type): string {
  if (type.isNone) {
    return "none";
  }
  if (type.isAny) {
    return "any";
  }
  if (type.isBlock) {
    return "[block]";
  }
  return type.reference?.name || "unknown";
}

function parametersString(parameters: Parameter[]): string {
  return parameters
    .map((parameter) => {
      let param = parameter.name;
      if (parameter.isNamed) {
        param = "--" + param;
      }
      if (parameter.isBlock) {
        param = "[" + param + "]";
        return param;
      }
      return param + "/" + typeString(parameter.type);
    })
    .join(" ");
}

function flattenMethod(
  libraries: Libraries,
  method: Method,
  result: SearchableModel
): void {
  result.methods.push({
    name: method.name,
    ref: method.id,
    className: method.id.classRef.name,
    parameters: parametersString(method.parameters),
    url: methodUrlFromRef(libraries, method.id),
    type: "method",
  });
}

function flattenFunction(
  libraries: Libraries,
  fhunction: Function,
  result: SearchableModel
): void {
  result.functions.push({
    name: fhunction.name,
    ref: fhunction.id,
    parameters: parametersString(fhunction.parameters),
    url: functionUrlFromRef(libraries, fhunction.id),
    type: "function",
  });
}

function flattenClass(
  libraries: Libraries,
  klass: Class,
  result: SearchableModel
): void {
  result.classes.push({
    name: klass.name,
    ref: klass.id,
    url: classUrlFromRef(klass.id),
    type: "class",
  });

  klass.statics
    .concat(klass.methods)
    .forEach((m) => flattenMethod(libraries, m, result));
}

function flattenInterface(
  libraries: Libraries,
  inter: Class,
  result: SearchableModel
): void {
  result.interfaces.push({
    name: inter.name,
    ref: inter.id,
    url: classUrlFromRef(inter.id),
    type: "interface",
  });

  inter.statics
    .concat(inter.methods)
    .forEach((m) => flattenMethod(libraries, m, result));
}

function flattenLibrary(
  libraries: Libraries,
  library: Library,
  result: SearchableModel
): void {
  result.libraries.push({
    name: library.name,
    ref: library.id,
    url: libraryUrlFromRef(library.id),
    type: "library",
  });

  Object.values(library.libraries).forEach((m) =>
    flattenLibrary(libraries, m, result)
  );
  Object.values(library.interfaces).forEach((inter) =>
    flattenInterface(libraries, inter, result)
  );
  Object.values(library.classes).forEach((c) =>
    flattenClass(libraries, c, result)
  );
  Object.values(library.functions).forEach((f) =>
    flattenFunction(libraries, f, result)
  );
}

export function flatten(libraries: Libraries | undefined): SearchableModel {
  const result = {
    libraries: [],
    classes: [],
    interfaces: [],
    functions: [],
    methods: [],
  };
  if (!libraries) {
    return result;
  }

  Object.values(libraries).forEach((m) => flattenLibrary(libraries, m, result));
  return result;
}

type SearchableType = "library" | "class" | "interface" | "function" | "method";

export interface Searchable {
  type: SearchableType;
  name: string;
  url: string;
}

export interface SearchableModel {
  libraries: SearchableLibrary[];
  classes: SearchableClass[];
  interfaces: SearchableInterface[];
  functions: SearchableFunction[];
  methods: SearchableMethod[];
}

export interface SearchableLibrary extends Searchable {
  name: string;
  ref: TopLevelRef;
  url: string;
  type: "library";
}

export interface SearchableClass extends Searchable {
  name: string;
  ref: TopLevelItemRef;
  url: string;
  type: "class";
}

export interface SearchableInterface extends Searchable {
  name: string;
  ref: TopLevelItemRef;
  url: string;
  type: "interface";
}

export interface SearchableFunction extends Searchable {
  name: string;
  ref: TopLevelItemRef;
  parameters: string;
  url: string;
  type: "function";
}

export interface SearchableMethod extends Searchable {
  name: string;
  ref: ClassMemberRef;
  className: string;
  parameters: string;
  url: string;
  type: "method";
}
