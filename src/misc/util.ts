import { getId } from "../components/sdk/Functions";
import { Class, Function, Libraries, Library, Method } from "../model/model";
import {
  ClassMemberRef,
  TopLevelItemRef,
  TopLevelRef,
} from "../model/reference";

export function libraryFrom(
  libraryName: string,
  rootLibraries: Libraries
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
  rootLibraries: Libraries
): Class | undefined {
  const library = libraryFrom(libraryName, rootLibraries);
  return (
    library?.classes[className] ||
    library?.exportedClasses[className] ||
    library?.interfaces[className] ||
    library?.exportedInterfaces[className]
  );
}

export function libraryFromRef(
  rootLibraries: Libraries,
  ref: TopLevelRef
): Library | undefined {
  return libraryFrom(ref.path.join("/"), rootLibraries);
}

export function classFromRef(
  rootLibraries: Libraries,
  ref: TopLevelItemRef
): Class | undefined {
  const library = libraryFromRef(rootLibraries, ref.libraryRef);
  if (!library || ref.offset === undefined) {
    return undefined;
  }

  return (
    Object.values(library.classes)[ref.offset] ||
    Object.values(library.exportedClasses)[ref.offset] ||
    Object.values(library.interfaces)[ref.offset] ||
    Object.values(library.exportedInterfaces)[ref.offset]
  );
}

export function functionFromRef(
  rootLibraries: Libraries,
  ref: TopLevelItemRef
): Function | undefined {
  const library = libraryFromRef(rootLibraries, ref.libraryRef);
  if (!library || ref.offset === undefined) {
    return undefined;
  }

  return library.functions[ref.offset] || library.exportedFunctions[ref.offset];
}

export function methodFromRef(
  rootLibraries: Libraries,
  ref: ClassMemberRef
): Method | undefined {
  const klass = classFromRef(rootLibraries, ref.classRef);
  if (!klass || ref.offset === undefined) {
    return undefined;
  }
  return klass.methods[ref.offset] || klass.statics[ref.offset];
}

export function topLevelRefToId(ref: TopLevelRef): string {
  return ref.name + "-" + ref.path.join("/");
}

export function classUrlFromRef(ref: TopLevelItemRef): string {
  return "/" + ref.libraryRef.path.join("/") + "/class-" + ref.name;
}

export function libraryUrlFromRef(ref: TopLevelRef): string {
  return "/" + ref.path.join("/") + "/library-summary";
}

export function functionUrlFromRef(
  rootLibraries: Libraries,
  ref: TopLevelItemRef
): string {
  const fhunction = functionFromRef(rootLibraries, ref);
  if (!fhunction) {
    return "/";
  }
  return (
    libraryUrlFromRef(ref.libraryRef) +
    "#" +
    getId(fhunction.name, fhunction.shape)
  );
}

export function methodUrlFromRef(
  rootLibraries: Libraries,
  ref: ClassMemberRef
): string {
  const method = methodFromRef(rootLibraries, ref);
  if (!method) {
    return "/";
  }
  return classUrlFromRef(ref.classRef) + "#" + getId(method.name, method.shape);
}
