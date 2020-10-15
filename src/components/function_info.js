// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
// import React from "react";
// import data from "../libraries.json";
// import Grid from "@material-ui/core/Grid";
// import Typography from "@material-ui/core/Typography";
// import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Box from "@material-ui/core/Box";
import { ArrowRightAlt } from "@material-ui/icons";
import Toitdocs from "./toitdoc_info";
import { Parameters } from "./parameters";

function ReturnType({ returnType, returnPath }) {
  if (returnType !== "none" && returnType !== "any") {
    return (
      <span>
        <Link to={`/${returnPath}/${returnType}`}>{returnType}</Link>
      </span>
    );
  } else {
    return <span>{returnType}</span>;
  }
}

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
    const {
      params: {
        libName,
        moduleName,
        className,
        functionType,
        functionName,
        index,
      },
    } = this.props.match;
    var function_info = null;

    var page_title = "Unknown";

    const library = this.props.libraries.find(({ name }) => name === libName)
    const module = library ? library.modules.find(({ name }) => name === moduleName) : null

    let class_info = module.module_classes.find(({ name }) => name === className);
    if (!class_info) {
      class_info = module.export_classes.find(({ name }) => name === className);
    }

    if (functionType === "Constructors") {
      try {
        function_info = class_info.structure.constructors[index];
      } catch {
        return null;
      }
      page_title = "Constructor of class: " + className;
    } else if (functionType === "Factories") {
      try {
        function_info = class_info.structure.factories[index];
      } catch {
        return null;
      }
      page_title = "Factory of class: " + className;
    } else if (functionType === "Methods") {
      try {
        function_info = class_info.structure.methods.find(({ name }) => name === functionName);
      } catch {
        return null;
      }

      page_title = "Function name: " + functionName;
    } else if (functionType === "Statics") {
      try {
        function_info = class_info.structure.statics.find(({ name }) => name === functionName);
      } catch {
        return null;
      }
      page_title = "Function name: " + functionName;
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
                <span>
                  <ReturnType
                    returnType={function_info.return_type}
                    returnPath={function_info.return_type_path}
                  />
                </span>
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
              {/* <ListFunctions
              libName={libName}
              moduleName={moduleName}
              className={className}
              functionType={functionType}
              functionName={functionName}
              /> */}
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
