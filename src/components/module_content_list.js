// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {
    width: "100%",
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
});

function PrintClasses(object) {
  try {
    let already_listed = [];
    return [].concat(object.value.module_classes).map((element) => {
      if (!already_listed.includes(element.class_name)) {
        already_listed.push(element.class_name);
        return <li key={"class_name_"}> {element.class_name} </li>;
      }
    });
  } catch (err) {
    return null;
  }
}

function PrintExpClasses(object) {
  try {
    let already_listed = [];
    return [].concat(object.value.export_classes).map((element, i) => {
      if (!already_listed.includes(element.class_name)) {
        already_listed.push(element.class_name);
        return <li key={"exp_class_name" + i}> {element.class_name} </li>;
      }
    });
  } catch (err) {
    return null;
  }
}

function PrintGlobFcn(object) {
  var output = [];
  try {
    let already_listed = [];
    return []
      .concat(object.value.top_level.module_functions)
      .map((element, i) => {
        if (!already_listed.includes(element.class_name)) {
          return <li key={"glb_fcn_name_" + i}> {element.function_name} </li>;
        }
        already_listed.push(element.class_name);
      });
  } catch (err) {
    return null;
  }
}

function PrintGlobVar(object) {
  try {
    let already_listed = [];
    return []
      .concat(object.value.top_level.module_globals)
      .map((element, i) => {
        if (!already_listed.includes(element.class_name)) {
          return <li key={"glb_var_name_" + i}> {element.global_name} </li>;
        }
      });
  } catch (err) {
    return null;
  }
}

function PrintExpVar(object) {
  var output = [];
  try {
    let already_listed = [];
    output = object.value.top_level.export_globals.forEach((element, i) => {
      if (!already_listed.includes(element.class_name)) {
        return <li key={"exp_var_name" + i}> {element.global_name} </li>;
      }
    });
  } catch (err) {
    output = "";
  }
  return output;
}

function PrintExpFcn(object) {
  try {
    let already_listed = [];
    return [].concat(object.value.top_level.export_functions).map((element) => {
      if (!already_listed.includes(element.class_name)) {
        return <li key="exp_fcn_name"> {element.function_name} </li>;
      }
    });
  } catch (err) {
    return null;
  }
}

// Right sidebar that lists the content of module.
class ModuleContentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shown: {},
    };
  }

  render() {
    return (
      <div>
        <h4>Classes</h4>
        <ul>{PrintClasses(this.props)}</ul>

        <h4>Exported Classes</h4>
        <ul>{PrintExpClasses(this.props)}</ul>

        <h4>Variables</h4>
        <ul>{PrintGlobVar(this.props)}</ul>

        <h4>Functions</h4>
        <ul>{PrintGlobFcn(this.props)}</ul>

        <h4>Export variables</h4>
        <ul>{PrintExpVar(this.props)}</ul>

        <h4>Export functions</h4>
        <ul>{PrintExpFcn(this.props)}</ul>
      </div>
    );
  }
}

export default withStyles(styles)(ModuleContentList);
