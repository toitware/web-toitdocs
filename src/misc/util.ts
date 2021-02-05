import { getId } from "../components/sdk/Functions";
import { Class, Function, Method, Module, Modules } from "../model/model";
import {
  ClassMemberRef,
  TopLevelItemRef,
  TopLevelRef,
} from "../model/reference";

export function moduleFrom(
  moduleName: string,
  rootModules: Modules
): Module | undefined {
  const path = moduleName.split("/");
  let module = undefined;
  let modules = rootModules;

  for (const p of path) {
    module = modules[p];
    if (!module) {
      break;
    }
    modules = module.modules;
  }
  return module;
}

export function classFrom(
  moduleName: string,
  className: string,
  rootModules: Modules
): Class | undefined {
  const module = moduleFrom(moduleName, rootModules);
  return module?.classes[className] || module?.exportedClasses[className];
}

export function moduleFromRef(
  rootModules: Modules,
  ref: TopLevelRef
): Module | undefined {
  return moduleFrom(ref.path.join("/"), rootModules);
}

export function classFromRef(
  rootModules: Modules,
  ref: TopLevelItemRef
): Class | undefined {
  const module = moduleFromRef(rootModules, ref.moduleRef);
  if (!module || ref.offset === undefined) {
    return undefined;
  }

  return (
    Object.values(module.classes)[ref.offset] ||
    Object.values(module.exportedClasses)[ref.offset]
  );
}

export function functionFromRef(
  rootModules: Modules,
  ref: TopLevelItemRef
): Function | undefined {
  const module = moduleFromRef(rootModules, ref.moduleRef);
  if (!module || ref.offset === undefined) {
    return undefined;
  }

  return module.functions[ref.offset] || module.exportedFunctions[ref.offset];
}

export function methodFromRef(
  rootModules: Modules,
  ref: ClassMemberRef
): Method | undefined {
  const klass = classFromRef(rootModules, ref.classRef);
  if (!klass || ref.offset === undefined) {
    return undefined;
  }
  return klass.methods[ref.offset] || klass.statics[ref.offset];
}

export function topLevelRefToId(ref: TopLevelRef): string {
  return ref.name + "-" + ref.path.join("/");
}

export function classUrlFromRef(ref: TopLevelItemRef): string {
  return "/" + ref.moduleRef.path.join("/") + "/class-" + ref.name;
}

export function moduleUrlFromRef(ref: TopLevelRef): string {
  return "/" + ref.path.join("/") + "/module-summary";
}

export function functionUrlFromRef(
  rootModules: Modules,
  ref: TopLevelItemRef
): string {
  const fhunction = functionFromRef(rootModules, ref);
  if (!fhunction) {
    return "/";
  }
  return (
    moduleUrlFromRef(ref.moduleRef) +
    "#" +
    getId(fhunction.name, fhunction.parameters)
  );
}

export function methodUrlFromRef(
  rootModules: Modules,
  ref: ClassMemberRef
): string {
  const method = methodFromRef(rootModules, ref);
  if (!method) {
    return "/";
  }
  return (
    classUrlFromRef(ref.classRef) + "#" + getId(method.name, method.parameters)
  );
}
