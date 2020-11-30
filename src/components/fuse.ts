// Copyright (C) 2020 Toitware ApS. All rights reserved.

import Fuse from "fuse.js";
import {
  ToitClass,
  ToitDoc,
  ToitFunction,
  ToitGlobal,
  ToitLibraries,
  ToitLibrary,
  ToitModule,
  ToitObject,
  ToitStatementItemized,
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

// function findAliases(library: ToitLibrary): any[] {
//   const found = [];
//   function iterateToitdoc(toitdoc: ToitDoc, className, fnReturnType) {
//     try {
//       // TODO run though through this in a more structured way
//       if (toitdoc instanceof Array) {
//         toitdoc.forEach((obj) => {
//           iterateToitdoc(obj, className, fnReturnType);
//         });
//       } else if (toitdoc instanceof Object && toitdoc["object_type"]) {
//         if (
//           toitdoc["object_type"] === OBJECT_TYPE_SECTION &&
//           toitdoc["title"] === "Aliases"
//         ) {
//           toitdoc.statements.forEach((statement) => {
//             if (statement["object_type"] === OBJECT_TYPE_STATEMENT_ITEMIZED) {
//               (statement as ToitStatementItemized).items.forEach((item) => {
//                 if (
//                   item["object_type"] === OBJECT_TYPE_TOITDOCREF ||
//                   item["object_type"] === OBJECT_TYPE_STATEMENT_CODE
//                 ) {
//                   // TODO: need to copy the object before it must be manipulated.
//                   item.path = fnReturnType.name + "/" + className;
//                   found.push(item);
//                 }
//               });
//             }
//           });
//         }
//       }
//     } catch (e) {
//       console.log("ERROR: iterateObject() function failed", e);
//     }
//   }
//   function iterateFunction(
//     fn: ToitFunction,
//     className: string | undefined
//   ): void {
//     iterateToitdoc(fn.toitdoc, className, fn.return_type);
//   }
//   function iterateClass(klass: ToitClass): void {
//     iterateToitdoc(klass.toitdoc, klass.name, undefined);
//     klass.structure.constructors.forEach((constructor) =>
//       iterateFunction(constructor, klass.name)
//     );
//     klass.structure.factories.forEach((fac) =>
//       iterateFunction(fac, klass.name)
//     );
//     klass.structure.methods.forEach((method) =>
//       iterateFunction(method, klass.name)
//     );
//   }
//   function iterateGlobal(global: ToitGlobal): void {
//     iterateToitdoc(global.toitdoc, undefined, undefined);
//   }
//   function iterateModule(module: ToitModule): void {
//     module.classes.forEach((klass) => iterateClass(klass));
//     module.export_classes.forEach((klass) => iterateClass(klass));
//     module.functions.forEach((fn) => iterateFunction(fn, undefined));
//     module.export_functions.forEach((fn) => iterateFunction(fn, undefined));
//     module.globals.forEach((glob) => iterateGlobal(glob));
//     module.export_globals.forEach((glob) => iterateGlobal(glob));
//   }
//   function iterateLibrary(library: ToitLibrary): void {
//     Object.values(library.libraries).forEach((library) =>
//       iterateLibrary(library)
//     );
//     Object.values(library.modules).forEach((module) => iterateModule(module));
//   }
//   iterateLibrary(library);
//   return found;
// }

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

export interface SearchableToitObject {
  libraries: SearchableToitLibrary[];
  modules: SearchableToitModule[];
  classes: SearchableToitClass[];
}

interface SearchableToitLibrary {
  name: string;
  path: string[];
}

interface SearchableToitModule {
  name: string;
  library: string[];
}

interface SearchableToitClass {
  name: string;
  module: string;
  library: string[];
}

export default class ToitFuse {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // aliases(): Fuse<SearchableToitObject> {
  //   return new Fuse(findAliases(this.libraries[rootLibrary]), optionsAliases);
  // }
}
