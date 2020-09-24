// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React from "react";
import data from "../libraries.json";
import Grid from "@material-ui/core/Grid";
import ClassContentList from "./class_content_list";
import Toitdocs from "./toitdoc_info";
import { Methods } from "./methods";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Box from "@material-ui/core/Box";
import { Hidden } from "@material-ui/core";

function Extends({ extendText, extendURL }) {
  if (extendText !== undefined) {
    return (
      <div>
        <Link to={`/${extendURL}/${extendText}`}> extends {extendText}</Link>
      </div>
    );
  } else {
    return null;
  }
}

function Constructors(props) {
  if (props.value !== undefined) {
    return (
      <div>
        <Typography variant="h2" component="h2">
          Constructors:
        </Typography>
        <Methods
          value={props.value}
          libName={props.libName}
          moduleName={props.moduleName}
          className={props.className}
          functionType="Constructors"
        />
      </div>
    );
  } else {
    return null;
  }
}

function Statics(props) {
  if (props.value !== undefined) {
    return (
      <div>
        <Typography variant="h2" component="h2">
          Statics:
        </Typography>
        <Methods
          value={props.value}
          libName={props.libName}
          moduleName={props.moduleName}
          className={props.className}
          functionType="Statics"
        />
      </div>
    );
  } else {
    return null;
  }
}

function Factories(props) {
  if (props.value !== undefined) {
    return (
      <div>
        <Typography variant="h2" component="h2">
          Factories:
        </Typography>
        <Methods
          value={props.value}
          libName={props.libName}
          moduleName={props.moduleName}
          className={props.className}
          functionType="Factories"
        />
      </div>
    );
  } else {
    return null;
  }
}

function Members(props) {
  if (props.value !== undefined) {
    if (props.value.fields !== undefined) {
      return (
        <div>
          <Typography variant="h2" component="h2">
            Members:
          </Typography>
          <Typography variant="h3" component="h3">
            Fields:
          </Typography>
          {props.value.fields.map((index) => {
            return (
              <div key={index.field_name} >
                {/* TODO: link to field type */}
                <div className="functionName">
                  <strong>{index.field_name}</strong>/{index.field_type}
                </div>
                <Toitdocs value={index.field_toitdoc} />
              </div>
            );
          })}
          <Typography variant="h3" component="h3">
            Methods:
          </Typography>
          <Methods
            value={props.value.methods}
            libName={props.libName}
            moduleName={props.moduleName}
            className={props.className}
            functionType="Members"
          />
        </div>
      );
    } else {
      return (
        <div>
          <Typography variant="h2" component="h2">
            Members:
          </Typography>
          <Typography variant="h3" component="h3">
            Methods:
          </Typography>
          <Methods
            value={props.value.methods}
            libName={props.libName}
            moduleName={props.moduleName}
            className={props.className}
            functionType="Members"
          />
        </div>
      );
    }
  } else {
    return null;
  }
}
const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

// Returns description of the class
const ClassInfo = ({ match }) => {
  const classes = useStyles();
  const {
    params: { libName, moduleName, className },
  } = match;

  const class_info = data.libraries
    .find(({ lib_name }) => lib_name === libName)
    .lib_modules.find(({ module }) => module === moduleName)
    .module_classes.find(({ class_name }) => class_name === className);
  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12} sm={9}>
          <Box pt={2} pb={2}>
            <Typography variant="h1" component="h1">
              Class: {class_info.class_name}
            </Typography>
            <Extends
              extendText={class_info.extends}
              extendURL={class_info.extend_path}
            />
          </Box>
          <Constructors
            value={class_info.class_structure.constructors}
            libName={libName}
            moduleName={moduleName}
            className={className}
            functionType="Constructors"
          />
          <Factories
            value={class_info.class_structure.factories}
            libName={libName}
            moduleName={moduleName}
            className={className}
            functionType="Factories"
          />
          <Members
            value={class_info.class_structure.members}
            libName={libName}
            moduleName={moduleName}
            className={className}
            functionType="Members"
          />
          <Statics
            value={class_info.class_structure.statics}
            libName={libName}
            moduleName={moduleName}
            className={className}
            functionType="Statics"
          />
        </Grid>
        <Hidden xsDown>
          <Grid item sm={3}>
            <ClassContentList value={class_info} />
          </Grid>
        </Hidden>
      </Grid>
    </div>
  );
};

export default ClassInfo;
