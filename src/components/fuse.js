// Copyright (C) 2020 Toitware ApS. All rights reserved.

import Fuse from "fuse.js";
import {
  TYPE_FUNCTION,
  TYPE_CLASS,
  TYPE_SECTION,
  TYPE_STATEMENT_ITEMIZED,
  TYPE_TOITDOCREF,
  TYPE_STATEMENT_CODE,
} from "./../sdk.js";

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
  keys: [
    "libraries.name",
    "libraries.modules.name",
    "libraries.modules.module_classes.name",
  ],
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

const object_properties = [
  "toitdoc",
  "modules",
  "module_classes",
  "export_classes",
  "module_functions",
  "export_functions",
  "module_globals",
  "export_globals",
  "structure",
  "statics",
  "constructors",
  "factories",
  "fields",
  "methods",
  "parameters",
  "expressions",
];

function findAliases(object) {
  var found = [];
  iterateObject(object, "", "");

  function iterateObject(obj, current_return_path, current_class_name) {
    try {
      // TODO run though through this in a more structured way
      if (obj instanceof Array) {
        obj.forEach((obj) => { iterateObject(obj, current_return_path, current_class_name)});
      } else if (obj instanceof Object && obj["object_type"]) {
        if (obj["object_type"] === TYPE_FUNCTION && obj["return_type_path"]) {
          current_return_path = obj["return_type_path"];
        } else if (obj["object_Type"] === TYPE_CLASS) {
          current_class_name = obj["name"];
        }
        object_properties.forEach((prop) => {
          iterateObject(obj[prop], current_return_path, current_class_name);
        });
        if (obj["object_type"] === TYPE_SECTION && obj["title"] === "Aliases") {
          obj.statements.forEach((obj) => {
            if (obj["object_type"] === TYPE_STATEMENT_ITEMIZED) {
              obj.items.forEach((obj) => {
                if (obj["object_type"] === TYPE_TOITDOCREF || obj["object_type"] === TYPE_STATEMENT_CODE) {
                  // TODO: need to copy the object before it must be manipulated.
                  obj.path = current_return_path + "/" + current_class_name;
                  found.push(obj);
                }
              })
            }
          })
        }
      }
    } catch (e) {
      console.log("ERROR: iterateObject() function failed", e);
    }
  }
  return found;
}

export default function Component(data) {
  this.Index = Fuse.createIndex(optionsBasic.keys, [data]);
  this.Basic = new Fuse([data], optionsBasic, this.Index);
  this.Aliases = new Fuse(findAliases(data.libraries), optionsAliases);
}
