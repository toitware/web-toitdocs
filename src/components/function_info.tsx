// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { ArrowRightAlt } from "@material-ui/icons";
import Toitdocs from "./toitdoc_info";
import { Parameters } from "./parameters";
import { Type } from "./util";
import { getLibrary } from "../sdk";

const style = (theme) => ({
  root: {
    width: "100%",
  },
});

function mapStateToProps(state, props) {
  const { sdk } = state;
  return {
    version: sdk.version,
    libraries: sdk.object.libraries,
    match: props.match,
  };
}

class FunctionInfo extends Component {
  render() {
    let {
      params: {
        libName,
        moduleName,
        className,
        functionType,
        functionName,
        index,
      },
    } = this.props.match;
    functionType = functionType.toLowerCase();

    let function_info = null;

    let page_title = "Unknown";
    const library = getLibrary(this.props.libraries, libName);
    const module = library && library.modules[moduleName];

    if (!module) {
      return "Module not found";
    }

    let class_info = module.classes.find(({ name }) => name === className);
    if (!class_info) {
      class_info = module.export_classes.find(({ name }) => name === className);
    }

    if (!class_info) {
      return "Class not found";
    }

    if (functionType === "constructors") {
      function_info = class_info.structure.constructors[index];
      page_title = "Constructor of class: " + className;
    } else if (functionType === "factories") {
      function_info = class_info.structure.factories[index];
      page_title = "Factory of class: " + className;
    } else if (functionType === "methods") {
      function_info = class_info.structure.methods[index];
      page_title = "Function name: " + functionName;
    } else if (functionType === "statics") {
      function_info = class_info.structure.statics[index];
      page_title = "Static name: " + functionName;
    }

    if (function_info) {
      return (
        <div className={this.props.classes.root}>
          <Grid container>
            <Grid item xs={12} sm={9}>
              <Box pt={2} pb={2}>
                <Typography variant="h1" component="h1">
                  {page_title}
                </Typography>
              </Box>
              <Box>
                <code>
                  <Parameters value={function_info.parameters} />
                </code>
                <ArrowRightAlt
                  style={{
                    verticalAlign: "middle",
                    display: "inline-flex",
                  }}
                />
                <Type type={function_info.return_type}></Type>
              </Box>
              <Box>
                <Toitdocs value={function_info.toitdoc} />
              </Box>
            </Grid>
          </Grid>
        </div>
      );
    } else {
      return (
        <div className={this.props.classes.root}>
          <Grid container>
            <Grid item xs={12} sm={9}>
              <Typography variant="h1" component="h1">
                ERROR: {functionName} function info not found
              </Typography>
            </Grid>
          </Grid>
        </div>
      );
    }
  }
}

export default withStyles(style, { withTheme: true })(
  connect(mapStateToProps)(FunctionInfo)
);
