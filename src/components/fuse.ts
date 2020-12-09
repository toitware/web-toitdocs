// Copyright (C) 2020 Toitware ApS. All rights reserved.

import Fuse from "fuse.js";
import {
  ToitClass,
  ToitFunction,
  ToitLibrary,
  ToitModule,
  ToitObject,
  ToitStructure,
} from "../model/toitsdk";
import { rootLibrary } from "../sdk";

// Parameters for searching through libraries, modules and classes.
const optionsBasic = {
  shouldSort: false,
  includeMatches: true,
  findAllMatches: true,
  includeScore: true,
  threshold: 0.2,
  ignoreLocation: true,
  maxPatternLength: 32,
  minMatchCharLength: 2,
  keys: ["libraries.name", "modules.name", "classes.name"],
};

function flattenDataStructureFunction(
  library: ToitLibrary,
  module: ToitModule,
  klass: ToitClass,
  fun: ToitFunction,
  struct_type: string,
  result: SearchableToitObject
): void {
  result.functions.push({
    name: fun.name,
    module: module.name,
    library: library.path,
    class: klass.name,
    struct_type: struct_type,
  });
}

function flattenDataStructureKlassStruct(
  library: ToitLibrary,
  module: ToitModule,
  klass: ToitClass,
  // function: ToitFunction,
  result: SearchableToitObject
): void {
  // result.functions.push({
  //   name: klass.name,
  //   module: module.name,
  //   library: library.path,
  // });
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
  klass.structure.constructors.forEach((func) =>
    flattenDataStructureFunction(
      library,
      module,
      klass,
      func,
      "constructors",
      result
    )
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
  result.libraries.push({ name: library.name, path: library.path });
  Object.values(library.libraries).forEach((library) =>
    flattenDataStructureLibrary(library, result)
  );
  Object.values(library.modules).forEach((module) =>
    flattenDataStructureModule(library, module, result)
  );
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
  struct_type: string;
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
