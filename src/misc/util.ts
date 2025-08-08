// Copyright (C) 2024 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import {
  Class,
  Function,
  Libraries,
  Library,
  Method,
  Shape,
} from "../model/model";
import {
  ClassMemberRef,
  LinkRef,
  TopLevelItemRef,
  TopLevelRef,
} from "../model/reference";

export function libraryFrom(
  libraryName: string,
  rootLibraries: Libraries,
): Library | undefined {
  const path = libraryName.split("/");
  let library = undefined;
  let libraries = rootLibraries;

  for (const p of path) {
    library = libraries[p];
    if (!library) {
      break;
    }
    libraries = library.libraries;
  }
  return library;
}

export function classFrom(
  libraryName: string,
  className: string,
  rootLibraries: Libraries,
): Class | undefined {
  const library = libraryFrom(libraryName, rootLibraries);
  return (
    library?.classes[className] ||
    library?.exportedClasses[className] ||
    library?.interfaces[className] ||
    library?.exportedInterfaces[className] ||
    library?.mixins[className] ||
    library?.exportedMixins[className]
  );
}

export function libraryFromRef(
  rootLibraries: Libraries,
  ref: TopLevelRef,
): Library | undefined {
  return libraryFrom(ref.path.join("/"), rootLibraries);
}

export function classFromRef(
  rootLibraries: Libraries,
  ref: TopLevelItemRef,
): Class | undefined {
  const library = libraryFromRef(rootLibraries, ref.libraryRef);
  if (!library || ref.offset === undefined) {
    return undefined;
  }

  return (
    Object.values(library.classes)[ref.offset] ||
    Object.values(library.exportedClasses)[ref.offset] ||
    Object.values(library.interfaces)[ref.offset] ||
    Object.values(library.exportedInterfaces)[ref.offset] ||
    Object.values(library.mixins)[ref.offset] ||
    Object.values(library.exportedMixins)[ref.offset]
  );
}

export function functionFromRef(
  rootLibraries: Libraries,
  ref: TopLevelItemRef,
): Function | undefined {
  const library = libraryFromRef(rootLibraries, ref.libraryRef);
  if (!library || ref.offset === undefined) {
    return undefined;
  }

  return library.functions[ref.offset] || library.exportedFunctions[ref.offset];
}

export function methodFromRef(
  rootLibraries: Libraries,
  ref: ClassMemberRef,
): Method | undefined {
  const klass = classFromRef(rootLibraries, ref.classRef);
  if (!klass || ref.offset === undefined) {
    return undefined;
  }
  return klass.methods[ref.offset] || klass.statics[ref.offset];
}

// URL related functions

export function getFunctionId(functionName: string, shape?: Shape): string {
  if (!shape) {
    return "";
  }
  const shapeString = `${shape.arity},${shape.totalBlockCount},${
    shape.namedBlockCount
  },${shape.names.join(",")}`;
  return encodeURIComponent(functionName + "(" + shapeString + ")");
}

export function getFieldId(fieldName: string): string {
  return fieldName;
}

function libraryUrl(baseUrl: string, path: string[]): string {
  return baseUrl + "/" + path.join("/") + "/library-summary";
}

function classUrl(baseUrl: string, path: string[], name: string): string {
  return baseUrl + "/" + path.join("/") + "/class-" + name;
}

function memberUrl(classUrl: string, id: string): string {
  return classUrl + "#" + id;
}

function globalUrl(libraryUrl: string, id: string): string {
  return libraryUrl + "#" + id;
}

export function topLevelRefToId(ref: TopLevelRef): string {
  return ref.name + "-" + ref.path.join("/");
}

export function classUrlFromRef(ref: TopLevelItemRef): string {
  return classUrl(ref.libraryRef.baseUrl, ref.libraryRef.path, ref.name);
}

export function libraryUrlFromRef(ref: TopLevelRef): string {
  return libraryUrl(ref.baseUrl, ref.path);
}

export function functionUrlFromRef(
  rootLibraries: Libraries,
  ref: TopLevelItemRef,
): string {
  const fhunction = functionFromRef(rootLibraries, ref);
  if (!fhunction) {
    return "/";
  }
  return globalUrl(
    libraryUrlFromRef(ref.libraryRef),
    getFunctionId(fhunction.name, fhunction.shape),
  );
}

export function methodUrlFromRef(
  rootLibraries: Libraries,
  ref: ClassMemberRef,
): string {
  const method = methodFromRef(rootLibraries, ref);
  if (!method) {
    return "/";
  }
  return memberUrl(
    classUrlFromRef(ref.classRef),
    getFunctionId(method.name, method.shape),
  );
}

export function urlFromLinkRef(ref: LinkRef): string {
  switch (ref.kind) {
    case "class":
      return classUrl(ref.baseUrl, ref.path, ref.name);
    case "constructor":
    case "factory":
    case "method":
    case "static-method":
      return memberUrl(
        classUrl(ref.baseUrl, ref.path, ref.holder),
        getFunctionId(ref.name, ref.shape),
      );
    case "field":
      return memberUrl(
        classUrl(ref.baseUrl, ref.path, ref.holder),
        getFieldId(ref.name),
      );
    case "global":
      return globalUrl(libraryUrl(ref.baseUrl, ref.path), ref.name);
    case "global-method":
      return globalUrl(
        libraryUrl(ref.baseUrl, ref.path),
        getFunctionId(ref.name, ref.shape),
      );
    case "parameter":
      return "";
    default:
      return "";
  }
}
