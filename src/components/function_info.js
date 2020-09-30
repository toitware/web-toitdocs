// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React from "react";
import data from "../libraries.json";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
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

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

const FunctionInfo = ({ match }) => {
  const classes = useStyles();
  let propsOk = true;
  [
    match.params.libName,
    match.params.moduleName,
    match.params.className,
    match.params.functionType,
    match.params.functionName,
    match.params.index,
  ].forEach((elem) => {
    if (elem === undefined || elem === null) {
      propsOk = false;
    }
  });

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

  if (propsOk) {
    var function_info;
    var page_title = "Unknown";

    if (functionType === "Constructors") {
      function_info = data.libraries
        .find(({ lib_name }) => lib_name === libName)
        .lib_modules.find(({ module }) => module === moduleName)
        .module_classes.find(({ class_name }) => class_name === className)
        .class_structure.constructors[index];

      page_title = "Constructor of class: " + className;
    } else if (functionType === "Factories") {
      function_info = data.libraries
        .find(({ lib_name }) => lib_name === libName)
        .lib_modules.find(({ module }) => module === moduleName)
        .module_classes.find(({ class_name }) => class_name === className)
        .class_structure.factories[index];

      page_title = "Factory of class: " + className;
    } else if (functionType === "Members" || functionType === "Methods") {
      function_info = data.libraries
        .find(({ lib_name }) => lib_name === libName)
        .lib_modules.find(({ module }) => module === moduleName)
        .module_classes.find(({ class_name }) => class_name === className)
        .class_structure.members.methods[index];

      page_title = "Function name: " + functionName;
    } else if (functionType === "Statics") {
      function_info = data.libraries
        .find(({ lib_name }) => lib_name === libName)
        .lib_modules.find(({ module }) => module === moduleName)
        .module_classes.find(({ class_name }) => class_name === className)
        .class_structure.statics[index];

      page_title = "Function name: " + functionName;
    } else {
      function_info = "Unknown type";
    }
   if (![undefined, null].includes(function_info)) {
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
    } else {
      return (
        <div className={classes.root}>
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
  } else {
    return (
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12} sm={9}>
            <Typography variant="h1" component="h1">
              ERROR: FunctionInfo received wrong parameters
            </Typography>
          </Grid>
        </Grid>
      </div>
    );
  }
};

export default FunctionInfo;
