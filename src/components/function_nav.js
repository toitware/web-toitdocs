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

function ConditionalLink(props){
  let restricted_signs = ["/", "%"];
  if(!restricted_signs.includes(props.elem.name)){
    return (<Link
      to={`/${props.props.libName}/${props.props.moduleName}/${props.props.className}/${
       props.categories_found[props.index].charAt(0).toUpperCase() + props.categories_found[props.index].slice(1)
      }/${props.elem.name}/${props.index}`}
    >
      {props.elem.name}
    </Link>)
  } else {
    return (
      <p>{props.elem.name}</p>
    )
  }
}

function ListFunctions(props) {
  const { libName, moduleName, className } = props;

  var functions_found = [];
  var categories_found = [];
  var category = "";
  const categories = [
    "statics",
    "factories",
    "methods",
    "constructors",
  ];

  const library = props.libraries.find(({ name }) => name === libName)
  const module = library ? library.modules.find(({ name }) => name === moduleName) : null

  let class_info = module.classes.find(({ name }) => name === className);
  if (!class_info) {
    class_info = module.export_classes.find(({ name }) => name === className);
  }

  iterateFunctions(class_info.structure);
  // let fun_index = AddFunIndexes(functions_found);

  function iterateFunctions(obj) {
    for (var prop in obj) {
      if (categories.includes(prop)) {
        category = prop;
      }
      if (obj[prop].name !== undefined) {
        functions_found.push(obj[prop]);
        categories_found.push(category);
      } else if (typeof obj[prop] === "object") {
        iterateFunctions(obj[prop]);
      }
    }
  }

  return (
      <div key={"list_functions"}>
    {functions_found.map((fn, index) => (
      <ListItem key={fn.name + "_" + index}>
        <ConditionalLink props={props} categories_found={categories_found} elem={fn} index={index}/>
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
