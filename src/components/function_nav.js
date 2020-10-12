// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, {Component}  from "react";
import {connect} from "react-redux"
import ListSubheader from "@material-ui/core/ListSubheader";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ErrorBoundary from "./error_page";

function mapStateToProps(state, props) {
  const { sdk } = state
  return { version: sdk.version, libraries: sdk.object.libraries, match: props.match }
};

function AddFunIndexes(props) {
  let output = [];
  let found_names = {};
  console.log(output);
  if (props !== undefined) {
    try {
      props.map((fun, index) => {
        if (found_names["method_" + fun.function_name] !== undefined) {
          found_names["method_" + fun.function_name]++;
        } else {
          found_names["method_" + fun.function_name] = 0;
        }
        output[index] = found_names["method_" + fun.function_name];      
      });
    } catch {}
  }
  return output;
}

function ListFunctions(props) {
  var functions_found = [];
  var categories_found = [];
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
  const modules = props.libraries
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
      
      
      iterateFunctions(class_info);
      let fun_index = AddFunIndexes(functions_found);
      
      function iterateFunctions(obj) {
        for (var prop in obj) {
          if (categories.includes(prop)) {
            category = prop;
          }
          if (obj[prop].function_name !== undefined) {
            // obj[prop].category = category;
            functions_found.push(obj[prop]);
            categories_found.push(category);
          } else if (typeof obj[prop] === "object") {
            iterateFunctions(obj[prop]);
          }
        }
      }
      return (
        <div key={"list_functions"}>
      {functions_found.map((elem, index) => (
        <ListItem key={elem.functionName + "_"+ elem.fun_index}>
          <Link
            to={`/${props.libName}/${props.moduleName}/${props.className}/${
             categories_found[index].charAt(0).toUpperCase() + categories_found[index].slice(1)
            }/${elem.function_name}/${fun_index[index]}`}
          >
            {elem.function_name}
          </Link>
        </ListItem>
      ))}
    </div>
  );
}

class FunctionNav extends Component {
  render() {
    const {
      params: { libName, moduleName, className, functionType, functionName },
    } = this.props.match;
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
            libraries={this.props.libraries}
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
  }
};

export default connect(mapStateToProps)(FunctionNav);
