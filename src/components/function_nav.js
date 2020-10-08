// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React from "react";
import ListSubheader from "@material-ui/core/ListSubheader";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import data from "../libraries.json";
import ErrorBoundary from "./error_page";

// TODO: Fix the indexing!

function AddFunIndexes(props) {
  let output = props;
  let found_names = {};
  if (output !== undefined) {
    try {
      output.map((fun) => {
        if (found_names["method_" + fun.function_name] !== undefined) {
          found_names["method_" + fun.function_name]++;
        } else {
          found_names["method_" + fun.function_name] = 0;
        }
        fun.fun_index = found_names["method_" + fun.function_name];
      });
    } catch {}
  }
  return output;
}

function ListFunctions(props) {
  var functions_found = [];
  var category = "";
  const categories = [
    "statics",
    "factories",
    "members",
    "methods",
    "constructors",
  ];
  var class_info;
  var module_classes = {};
  var export_classes = {};
  const modules = data.libraries
    .find(({ lib_name }) => lib_name === props.libName)
    .lib_modules.find(({ module }) => module === props.moduleName);

  if (modules.module_classes !== undefined) {
    module_classes = modules.module_classes.find(
      (elem) => elem.class_name === props.className
    ).class_structure;
  }
  if (modules.export_classes !== undefined) {
    export_classes = modules.export_classes.find(
      (elem) => elem.class_name === props.className
    ).class_structure;
  }
  class_info = Object.assign(module_classes, export_classes);
  function iterateFunctions(obj) {
    for (var prop in obj) {
      if (categories.includes(prop)) {
        category = prop;
      }
      if (obj[prop].function_name !== undefined) {
        obj[prop].category = category;
        functions_found.push(obj[prop]);
      } else if (typeof obj[prop] === "object") {
        iterateFunctions(obj[prop]);
      }
    }
  }
  iterateFunctions(class_info);
  functions_found = AddFunIndexes(functions_found);

  return (
    <div key={"list_functions"}>
      {functions_found.map((elem) => (
        <ListItem key={elem.functionName + "_"+ elem.fun_index}>
          <Link
            to={`/${props.libName}/${props.moduleName}/${props.className}/${
              elem.category.charAt(0).toUpperCase() + elem.category.slice(1)
            }/${elem.function_name}/${elem.fun_index}`}
          >
            {elem.function_name}
          </Link>
        </ListItem>
      ))}
    </div>
  );
}

const FunctionNav = ({ match }) => {
  const {
    params: {
      libName,
      moduleName,
      className,
      functionType,
      functionName,
      index,
    },
  } = match;
  return (
    <div className="sideMenu">
      <ErrorBoundary>
        <List
          component="nav"
          disablePadding
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              <Link to={`/`}>modules</Link>
              {" / "}
              <Link to={`/${libName}`}>{libName}</Link>
              {" / "}
              <Link to={`/${libName}/${moduleName}`}>{moduleName}</Link>
              {" / "}
              <Link to={`/${libName}/${moduleName}/${className}`}>
                {className}
              </Link>
            </ListSubheader>
          }
        >
          <ListFunctions
            libName={libName}
            moduleName={moduleName}
            className={className}
            functionType={functionType}
            functionName={functionName}
          />
        </List>
      </ErrorBoundary>
    </div>
  );
};

export { FunctionNav, data };
