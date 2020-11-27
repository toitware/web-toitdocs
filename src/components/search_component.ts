// Copyright (C) 2020 Toitware ApS. All rights reserved.

//Returns a path to found library, class, module that's used for routing
function searchInLib(dataObject, whichKey, nameToFind) {
  const results = [];
  switch (whichKey) {
    case 0: //libraries.name
      for (let i = 0; i < dataObject.libraries.length; i++) {
        if (nameToFind === dataObject.libraries[i].name) {
          results.push(dataObject.libraries[i].name);
        }
      }
      break;
    case 1: //libraries.modules.name
      for (let i = 0; i < dataObject.libraries.length; i++) {
        for (
          let moduleI = 0;
          moduleI < dataObject.libraries[i].modules.length;
          moduleI++
        ) {
          if (nameToFind === dataObject.libraries[i].modules[moduleI].name) {
            results.push(
              dataObject.libraries[i].name +
                "/" +
                dataObject.libraries[i].modules[moduleI].name
            );
          }
        }
      }
      break;
    case 2: //libraries.modules.classes.name
      for (let i = 0; i < dataObject.libraries.length; i++) {
        try {
          for (
            let moduleI = 0;
            moduleI < dataObject.libraries[i].modules.length;
            moduleI++
          ) {
            for (
              let moduleClassI = 0;
              moduleClassI <
              dataObject.libraries[i].modules[moduleI].classes.length;
              moduleClassI++
            ) {
              if (
                nameToFind ===
                dataObject.libraries[i].modules[moduleI].classes[moduleClassI]
                  .name
              ) {
                results.push(
                  dataObject.libraries[i].name +
                    "/" +
                    dataObject.libraries[i].modules[moduleI].name +
                    "/" +
                    dataObject.libraries[i].modules[moduleI].classes[
                      moduleClassI
                    ].name
                );
              }
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

//Returns the path to the element which allows the routing
function searchInFuseResults(dataObject, item, indexJSON) {
  let out = "";
  try {
    const whichKey = indexJSON.keys.findIndex(
      (element) => element.id === item.key
    );
    const indexArray = indexJSON.records[0].$[whichKey];
    const foundMatches = [];
    indexArray.forEach((elem) => {
      if (elem.v === item.value) {
        foundMatches.push(elem.i);
      }
    });
    const whichInstance = foundMatches.findIndex(
      (elem) => elem === item.refIndex
    );

    const path = searchInLib(dataObject, whichKey, item.value);
    out = path[whichInstance];
  } catch (err) {
    console.log("ERROR: Path is wrong");
  }
  return out;
}

// Returns a list of found results.
function printResult(dataObject, result, indexJSON) {
  let output = [];
  try {
    if (![undefined, null].includes(result.matches)) {
      result.matches.forEach((elem) => {
        if (elem.key === "text") {
          // For Aliases.
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
            Path: searchInFuseResults(dataObject, elem, indexJSON),
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

export { printResult };
