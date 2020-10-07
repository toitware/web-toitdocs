// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, {Component} from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ClassContentList from "./class_content_list";
import Toitdocs from "./toitdoc_info";
import { Methods } from "./methods";
import Typography from "@material-ui/core/Typography";
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
const style = (theme) => ({
  root: {
    width: "100%",
  },
});

function mapStateToProps(state, props) {
  const { sdk } = state
  return { version: sdk.version, libraries: sdk.object.libraries, match: props.match }
}

// Returns description of the class
class ClassInfo extends Component {
  render() {
    const classes = this.props.classes;
    const {
      params: { libName, moduleName, className },
    } = this.props.match;

    const classObject = this.props.libraries
        .find(({ lib_name }) => lib_name === libName)
        .lib_modules.find(({ module }) => module === moduleName)
        .module_classes.find(({ class_name }) => class_name === className);
    return (
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12} sm={9}>
            <Box pt={2} pb={2}>
              <Typography variant="h1" component="h1">
                Class: {classObject.class_name}
              </Typography>
              <Extends
                extendText={classObject.extends}
                extendURL={classObject.extend_path}
              />
            </Box>
            <Constructors
              value={classObject.class_structure.constructors}
              libName={libName}
              moduleName={moduleName}
              className={className}
              functionType="Constructors"
            />
            <Factories
              value={classObject.class_structure.factories}
              libName={libName}
              moduleName={moduleName}
              className={className}
              functionType="Factories"
            />
            <Members
              value={classObject.class_structure.members}
              libName={libName}
              moduleName={moduleName}
              className={className}
              functionType="Members"
            />
            <Statics
              value={classObject.class_structure.statics}
              libName={libName}
              moduleName={moduleName}
              className={className}
              functionType="Statics"
            />
          </Grid>
          <Hidden xsDown>
            <Grid item sm={3}>
              <ClassContentList value={classObject} />
            </Grid>
          </Hidden>
        </Grid>
      </div>
    );
  }
};

export default withStyles(style, {withTheme: true})(connect(mapStateToProps)(ClassInfo));
