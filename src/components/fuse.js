// Copyright (C) 2020 Toitware ApS. All rights reserved.

import Fuse from "fuse.js";
import data from "../libraries.json";

//Parameters for searching through libraries, modules and classes
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
    "libraries.lib_name",
    "libraries.lib_modules.module",
    "libraries.lib_modules.module_classes.class_name",
  ],
};

//Parameters for searching through Aliases
const foundAliases = findAliases(data.libraries);

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

function findAliases(object) {
  var found = [];
  iterateObject(object, "", "");

  function iterateObject(obj, current_return_path, current_class_name) {
    try {
      for (var prop in obj) {
        if (prop === "return_path") {
          current_return_path = obj[prop];
        } else if (prop === "class_name") {
          current_class_name = obj[prop];
        }

        if (typeof obj[prop] === "object") {
          iterateObject(obj[prop], current_return_path, current_class_name);
        } else {
          if ((prop === "title") & (obj[prop] === "Aliases")) {
            for (var i = 0; i < obj.statements.length; i++) {
              for (var j = 0; j < obj.statements[i].length; j++) {
                for (var k = 0; k < obj.statements[i][j].itemized.length; k++) {
                  for (var l = 0; l < obj.statements[i][j].itemized[k].length; l++) {
                    var element = obj.statements[i][j].itemized[k][l];
                    if (element.is_code === true) {
                      var tempObj = element;
                      tempObj.path =
                        current_return_path + "/" + current_class_name;
                      found.push(tempObj);
                    }
                  }
                }
              }
            }
          }
        }
      }
    } catch {
      console.log("ERROR: iterateObject() function failed");
    }
  }
  return found;
}

//Create search modules
const myIndex = Fuse.createIndex(optionsBasic.keys, [data]);
const fuseBasic = new Fuse([data], optionsBasic, myIndex);
const fuseAliases = new Fuse(foundAliases, optionsAliases);

export { fuseBasic as fuse, fuseAliases, myIndex };
