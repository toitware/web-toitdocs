import { Class, Module, Modules } from "../model/model";
import { TopLevelItemRef, TopLevelRef } from "../model/reference";

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

export function topLevelRefToId(ref: TopLevelRef): string {
  return ref.name + "-" + ref.path.join("/");
}

export function classUrlFromRef(ref: TopLevelItemRef): string {
  return "/" + ref.path.join("/") + "/class-" + ref.name + ".html";
}

export function moduleUrlFromRef(ref: TopLevelRef): string {
  return "/" + ref.path.join("/") + "/module-summary.html";
}
