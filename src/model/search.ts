// Copyright (C) 2020 Toitware ApS. All rights reserved.

import {
  classUrlFromRef,
  functionUrlFromRef,
  methodUrlFromRef,
  moduleUrlFromRef,
} from "../misc/util";
import {
  Class,
  Function,
  Method,
  Module,
  Modules,
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
  modules: Modules,
  method: Method,
  result: SearchableModel
): void {
  result.methods.push({
    name: method.name,
    ref: method.id,
    className: method.id.classRef.name,
    parameters: parametersString(method.parameters),
    url: methodUrlFromRef(modules, method.id),
  });
}

function flattenFunction(
  modules: Modules,
  fhunction: Function,
  result: SearchableModel
): void {
  result.functions.push({
    name: fhunction.name,
    ref: fhunction.id,
    parameters: parametersString(fhunction.parameters),
    url: functionUrlFromRef(modules, fhunction.id),
  });
}

function flattenClass(
  modules: Modules,
  klass: Class,
  result: SearchableModel
): void {
  result.classes.push({
    name: klass.name,
    ref: klass.id,
    url: classUrlFromRef(klass.id),
  });

  klass.statics
    .concat(klass.methods)
    .forEach((m) => flattenMethod(modules, m, result));
}

function flattenModule(
  modules: Modules,
  module: Module,
  result: SearchableModel
): void {
  result.modules.push({
    name: module.name,
    ref: module.id,
    url: moduleUrlFromRef(module.id),
  });

  Object.values(module.modules).forEach((m) =>
    flattenModule(modules, m, result)
  );
  Object.values(module.classes).forEach((c) =>
    flattenClass(modules, c, result)
  );
  Object.values(module.functions).forEach((f) =>
    flattenFunction(modules, f, result)
  );
}

export function flatten(modules: Modules | undefined): SearchableModel {
  const result = {
    modules: [],
    classes: [],
    functions: [],
    methods: [],
  };
  if (!modules) {
    return result;
  }

  Object.values(modules).forEach((m) => flattenModule(modules, m, result));
  return result;
}

export interface SearchableModel {
  modules: SearchableModule[];
  classes: SearchableClass[];
  functions: SearchableFunction[];
  methods: SearchableMethod[];
}

export interface SearchableModule {
  name: string;
  ref: TopLevelRef;
  url: string;
}

export interface SearchableClass {
  name: string;
  ref: TopLevelItemRef;
  url: string;
}

export interface SearchableFunction {
  name: string;
  ref: TopLevelItemRef;
  parameters: string;
  url: string;
}

export interface SearchableMethod {
  name: string;
  ref: ClassMemberRef;
  className: string;
  parameters: string;
  url: string;
}
