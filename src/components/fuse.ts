// Copyright (C) 2020 Toitware ApS. All rights reserved.

import Fuse from "fuse.js";
import {
  ToitClass,
  ToitLibraries,
  ToitLibrary,
  ToitModule,
  ToitModules,
  ToitObject,
} from "../model/toitsdk";
import {
  OBJECT_TYPE_SECTION,
  OBJECT_TYPE_STATEMENT_ITEMIZED,
  OBJECT_TYPE_TOITDOCREF,
  OBJECT_TYPE_STATEMENT_CODE,
  rootLibrary,
} from "../sdk";

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

const optionsAliases = {
  shouldSort: false,
  includeMatches: true,
  findAllMatches: true,
  includeScore: true,
  threshold: 0.2,
  ignoreLocation: true,
  maxPatternLength: 32,
  minMatchCharLength: 2,
  keys: ["text"],
};

function findAliases(library) {
  const found = [];

  function iterateToitdoc(obj, className, fnReturnType) {
    try {
      // TODO run though through this in a more structured way
      if (obj instanceof Array) {
        obj.forEach((obj) => {
          iterateToitdoc(obj, className, fnReturnType);
        });
      } else if (obj instanceof Object && obj["object_type"]) {
        if (
          obj["object_type"] === OBJECT_TYPE_SECTION &&
          obj["title"] === "Aliases"
        ) {
          obj.statements.forEach((obj) => {
            if (obj["object_type"] === OBJECT_TYPE_STATEMENT_ITEMIZED) {
              obj.items.forEach((obj) => {
                if (
                  obj["object_type"] === OBJECT_TYPE_TOITDOCREF ||
                  obj["object_type"] === OBJECT_TYPE_STATEMENT_CODE
                ) {
                  // TODO: need to copy the object before it must be manipulated.
                  obj.path = fnReturnType.name + "/" + className;
                  found.push(obj);
                }
              });
            }
          });
        }
      }
    } catch (e) {
      console.log("ERROR: iterateObject() function failed", e);
    }
  }

  function iterateFunction(fn, className) {
    iterateToitdoc(fn.toitdoc, className, fn.return_type);
  }

  function iterateClass(klass) {
    iterateToitdoc(klass.toitdoc, klass.name, null);
    klass.structure.constructors.forEach((constructor) =>
      iterateFunction(constructor, klass.name)
    );
    klass.structure.factories.forEach((fac) =>
      iterateFunction(fac, klass.name)
    );
    klass.structure.methods.forEach((method) =>
      iterateFunction(method, klass.name)
    );
  }

  function iterateGlobal(glob) {
    iterateToitdoc(glob.toitdoc, null, null);
  }

  function iterateModule(module) {
    module.classes.forEach((klass) => iterateClass(klass));
    module.export_classes.forEach((klass) => iterateClass(klass));
    module.functions.forEach((fn) => iterateFunction(fn, null));
    module.export_functions.forEach((fn) => iterateFunction(fn, null));
    module.globals.forEach((glob) => iterateGlobal(glob));
    module.export_globals.forEach((glob) => iterateGlobal(glob));
  }

  function iterateLibrary(library) {
    Object.values(library.libraries).forEach((library) =>
      iterateLibrary(library)
    );
    Object.values(library.modules).forEach((module) => iterateModule(module));
  }

  iterateLibrary(library);

  return found;
}

function flattenDataStructureKlass(library, module, klass, result) {
  result.classes.push({
    name: klass.name,
    module: module.name,
    library: library.path,
  });
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
  };
  if (!data) {
    return result;
  }

  const library = data.libraries[rootLibrary];
  flattenDataStructureLibrary(library, result);
  return result;
}

interface SearchableToitObject {
  libraries: SearchableToitLibrary[];
  modules: SearchableToitModule[];
  classes: ToitClass[];
}

interface SearchableToitLibrary {
  name: string;
  path: string[];
}

interface SearchableToitModule {
  name: string;
  library: string[];
}

export default class ToitFuse {
  private index: any;
  private searchObject: SearchableToitObject;
  private libraries: ToitLibraries;

  constructor(searchObject: SearchableToitObject, libraries: ToitLibraries) {
    this.searchObject = searchObject;
    this.libraries = libraries;
    this.index = Fuse.createIndex(optionsBasic.keys, [searchObject]);
  }

  basic(): Fuse<SearchableToitObject> {
    return new Fuse([this.searchObject], optionsBasic, this.index);
  }

  aliases(): Fuse<SearchableToitObject> {
    return new Fuse(findAliases(this.libraries[rootLibrary]), optionsAliases);
  }
}
