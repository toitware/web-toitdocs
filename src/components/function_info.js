// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, {Component} from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
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
  const { sdk } = state
  return { version: sdk.version, libraries: sdk.object.libraries, match: props.match }
}

class FunctionInfo extends Component {
  render() {
    const classes = this.props.classes;
    const {
      params: { libName, moduleName, className, functionType, functionName, index },
    } = this.props.match;

    var function_info;
    var page_title = "Unknown";

    const classObject = this.props.libraries
      .find(({ lib_name }) => lib_name === libName)
      .lib_modules.find(({ module }) => module === moduleName)
      .module_classes.find(({ class_name }) => class_name === className)

    if (functionType === "Constructors") {
      function_info = classObject
        .class_structure.constructors[index]
        // .find(({ function_name }) => function_name === functionName
        // );

      page_title = "Constructor of class: " + className;
    } else if (functionType === "Factories") {
      function_info = classObject
        .class_structure.factories[index]
        // .find(
        //   ({ function_name }) => function_name === functionName
        // );

      page_title = "Factory of class: " + className;
    } else if (functionType === "Members" || functionType === "Methods") {
      function_info = classObject
        .class_structure.members.methods[index]
        // .find(
        //   ({ function_name }) => function_name === functionName
        // );

      page_title = "Function name: " + functionName;
    } else if (functionType === "Statics") {
      function_info = classObject
        .class_structure.statics[index]
        // .find(
        //   ({ function_name }) => function_name === functionName
        // );

      page_title = "Function name: " + functionName;
    }  else {
      function_info = "Unknown type";
    }

    console.log(function_info)

    return (
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12} sm={9}>
            <Box pt={2} pb={2}>
              <Typography variant="h1" component="h1">
                {page_title}
              </Typography>
            </Box>
            <Box>
            <code><Parameters value={function_info.parameters} /></code>
              <ArrowRightAlt
                style={{
                  verticalAlign: "middle",
                  display: "inline-flex",
                }}
              />
              <span>
                <ReturnType
                  returnType={function_info.return_type}
                  returnPath={function_info.return_path}
                />
              </span>
            </Box>
            <Box>
              <Toitdocs value={function_info.function_toitdoc} />
            </Box>
          </Grid>
        </Grid>
      </div>
    );
  }
};

export default withStyles(style, {withTheme: true})(connect(mapStateToProps)(FunctionInfo));
