// Copyright (C) 2020 Toitware ApS. All rights reserved.

import Fuse from "fuse.js";
import {
  ToitClass,
  ToitFunction,
  ToitLibrary,
  ToitModule,
  ToitObject,
  ToitParameter,
} from "../model/toitsdk";
import { rootLibrary } from "../sdk";

// Parameters for searching through libraries, modules and classes.
const optionsBasic = {
  shouldSort: false,
  includeMatches: true,
  findAllMatches: true,
  includeScore: true,
  threshold: 0.1,
  ignoreLocation: true,
  maxPatternLength: 32,
  minMatchCharLength: 2,
  keys: ["libraries.name", "modules.name", "classes.name", "functions.name"],
};

function flattenDataStructureFunction(
  library: ToitLibrary,
  module: ToitModule,
  klass: ToitClass,
  fun: ToitFunction,
  result: SearchableToitObject
): void {
  result.functions.push({
    name: fun.name,
    module: module.name,
    library: library.path,
    class: klass.name,
    functionParameters: fun.parameters,
  });
}

function flattenDataStructureKlass(
  library: ToitLibrary,
  module: ToitModule,
  klass: ToitClass,
  result: SearchableToitObject
): void {
  result.classes.push({
    name: klass.name,
    module: module.name,
    library: library.path,
  });
  klass.structure.methods.forEach((func) =>
    flattenDataStructureFunction(library, module, klass, func, result)
  );
  klass.structure.statics.forEach((func) =>
    flattenDataStructureFunction(library, module, klass, func, result)
  );
}

function flattenDataStructureModule(
  library: ToitLibrary,
  module: ToitModule,
  result: SearchableToitObject
): void {
  result.modules.push({ name: module.name, library: library.path });
  module.classes.forEach((klass) =>
    flattenDataStructureKlass(library, module, klass, result)
  );
}

function flattenDataStructureLibrary(
  library: ToitLibrary,
  result: SearchableToitObject
): void {
  if (library.name !== "lib") {
    result.libraries.push({ name: library.name, path: library.path });
  }
  Object.values(library.libraries).forEach((library) => {
    /* This is a temporary solution for removing the fonts from the results
       We should edit the toit generator and change the structure   
    */
    if (!library.path.includes("font")) {
      flattenDataStructureLibrary(library, result);
    }
  });
  Object.values(library.modules).forEach((module) => {
    if (!library.path.includes("font")) {
      flattenDataStructureModule(library, module, result);
    }
  });
}

export function flattenDataStructure(
  data: ToitObject | undefined
): SearchableToitObject {
  const result = {
    libraries: [],
    modules: [],
    classes: [],
    functions: [],
  };
  if (!data) {
    return result;
  }

  const library = data.libraries[rootLibrary];
  flattenDataStructureLibrary(library, result);
  return result;
}

export interface SearchableToitObject {
  libraries: SearchableToitLibrary[];
  modules: SearchableToitModule[];
  classes: SearchableToitClass[];
  functions: SearchableToitFunction[];
}

export interface SearchableToitLibrary {
  name: string;
  path: string[];
}

export interface SearchableToitModule {
  name: string;
  library: string[];
}

export interface SearchableToitClass {
  name: string;
  module: string;
  library: string[];
}

export interface SearchableToitFunction {
  name: string;
  module: string;
  library: string[];
  class: string;
  functionParameters: ToitParameter[];
}

export default class ToitFuse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private index: any;
  private searchObject: SearchableToitObject;

  constructor(searchObject: SearchableToitObject) {
    this.searchObject = searchObject;
    this.index = Fuse.createIndex(optionsBasic.keys, [searchObject]);
  }

  basic(): Fuse<SearchableToitObject> {
    return new Fuse([this.searchObject], optionsBasic, this.index);
  }
}
