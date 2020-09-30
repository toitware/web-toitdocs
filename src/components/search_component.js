// Copyright (C) 2020 Toitware ApS. All rights reserved.

import data from "../libraries.json";

//Returns a list of found results
function printResult(result, indexJSON) {
  let output = [];
  try {
    if (![undefined, null].includes(result.matches)) {
      result.matches.map((elem) => {
        if (elem.key === "text") {
          //For Aliases
          output.push({
            Name: elem.value,
            Type: "alias",
            Path: elem.path,
          });
        } else {
          //For libraries, modules, classes
          output.push({
            Name: elem.value,
            Type: elem.key,
            Path: searchInFuseResults(elem, indexJSON),
          });
        }
      });
    } 
    
  } catch (err) {
    output = ["Error."];
    console.log("ERROR: Nothing found.");
  }
  return output;
}

//Returns the path to the element which allows the routing
function searchInFuseResults(item, indexJSON) {
  var out = "";
  try {
    let which_key = indexJSON.keys.findIndex((element) => element.id === item.key);
    let index_array = indexJSON.records[0].$[which_key];
    let found_matches = [];
    index_array.map((elem) => {
      if (elem.v === item.value) {
        found_matches.push(elem.i);
      }
    });
    let which_instance = found_matches.findIndex(
      (elem) => elem === item.refIndex
    );

    let path = searchInLib(which_key, item.value, data);
    out = path[which_instance];
  } catch (err) {
    console.log("ERROR: Path is wrong");
  }
  return out;
}

//Returns a path to found library, class, module that's used for routing
function searchInLib(which_key, name_to_find, data) {
  let results = [];
  switch (which_key) {
    case 0: //libraries.lib_name
      for (let lib_i = 0; lib_i < data.libraries.length; lib_i++) {
        if (name_to_find === data.libraries[lib_i].lib_name) {
          results.push(data.libraries[lib_i].lib_name);
        }
      }
      break;
    case 1: //libraries.lib_modules.module
      for (let lib_i = 0; lib_i < data.libraries.length; lib_i++) {
        for (
          let lib_module_i = 0;
          lib_module_i < data.libraries[lib_i].lib_modules.length;
          lib_module_i++
        ) {
          if (
            name_to_find ===
            data.libraries[lib_i].lib_modules[lib_module_i].module
          ) {
            results.push(
              data.libraries[lib_i].lib_name +
                "/" +
                data.libraries[lib_i].lib_modules[lib_module_i].module
            );
          }
        }
      }
      break;
    case 2: //libraries.lib_modules.module_classes.class_name
      for (let lib_i = 0; lib_i < data.libraries.length; lib_i++) {
        try {
          for (
            let lib_module_i = 0;
            lib_module_i < data.libraries[lib_i].lib_modules.length;
            lib_module_i++
          ) {
            if (
              "module_classes" in
              data.libraries[lib_i].lib_modules[lib_module_i]
            ) {
              for (
                let module_class_i = 0;
                module_class_i <
                data.libraries[lib_i].lib_modules[lib_module_i].module_classes
                  .length;
                module_class_i++
              ) {
                if (
                  name_to_find ===
                  data.libraries[lib_i].lib_modules[lib_module_i]
                    .module_classes[module_class_i].class_name
                ) {
                  results.push(
                    data.libraries[lib_i].lib_name +
                      "/" +
                      data.libraries[lib_i].lib_modules[lib_module_i].module +
                      "/" +
                      data.libraries[lib_i].lib_modules[lib_module_i]
                        .module_classes[module_class_i].class_name
                  );
                }
              }
            } else {
              //nothing
            }
          }
        } catch (err) {
          console.log("Lack of module classes");
        }
      }
      break;
    default:
      results.push("Wrong key");
  }
  return results;
}

export { printResult };
