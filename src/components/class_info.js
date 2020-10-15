// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, { Component } from "react";
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

function Extends({ text, url }) {
  if (text && url) {
    return (
      <div>
        <Link to={`/${url}/${text}`}> extends {text}</Link>
      </div>
    );
  }
}

function Constructors(props) {
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
}

function Statics(props) {
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
}

function Factories(props) {
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
}

function Fields(props) {
  return (
    <div>
      <Typography variant="h3" component="h3">
        Fields:
      </Typography>
      {props.value.map((elem, index) => {
          return (
            <div key={"class_field_"+ index}>
              {/* TODO: link to field type */}
              <div className="functionName">
                <strong>{elem.name}</strong>/{elem.type}
              </div>
              <Toitdocs value={elem.toitdoc} />
            </div>
          );
      })}
    </div>
  );
}
const style = (theme) => ({
  root: {
    width: "100%",
  },
});

function ClassMethods(props) {
  return (
    <div>
      <Typography variant="h3" component="h2">
        Methods:
      </Typography>
      <Methods
        value={props.value}
        libName={props.libName}
        moduleName={props.moduleName}
        className={props.className}
        functionType="Methods"
      />
    </div>
  );
}

function mapStateToProps(state, props) {
  const { sdk } = state;
  return {
    version: sdk.version,
    libraries: sdk.object.libraries,
    match: props.match,
  };
}

// Returns description of the class
class ClassInfo extends Component {
  notFound(name) {
    return (
      <Grid container>
        <Grid item xs={12} sm={9}>
          <Typography variant="h1" component="h1">
            Class: {name} not found!
          </Typography>
        </Grid>
      </Grid>
    );
  }

  render() {
    const classes = this.props.classes;
    const {
      params: { libName, moduleName, className },
    } = this.props.match;

    const library = this.props.libraries.find(({ name }) => name === libName)
    const module = library ? library.modules.find(({ name }) => name === moduleName) : null

    if (!module) {
      return this.notFound(className);
    }

    let class_info = module.module_classes.find(({ name }) => name === className);
    if (!class_info) {
      class_info = module.export_classes.find(({ name }) => name === className);
    }

    if (!class_info) {
      return this.notFound(className);
    }

    return (
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12} sm={9}>
            <Box pt={2} pb={2}>
              <Typography variant="h1" component="h1">
                Class: {class_info.name}
              </Typography>
              <Extends
                text={class_info.extends}
                url={class_info.extends_path}
              />
            </Box>
            <Constructors
              value={class_info.structure.constructors}
              libName={libName}
              moduleName={moduleName}
              className={className}
              functionType="Constructors"
            />
            <Factories
              value={class_info.structure.factories}
              libName={libName}
              moduleName={moduleName}
              className={className}
              functionType="Factories"
            />
            <Statics
              value={class_info.structure.statics}
              libName={libName}
              moduleName={moduleName}
              className={className}
              functionType="Statics"
            />
            <Fields value={class_info.structure.fields} />
            <ClassMethods
              value={class_info.structure.methods}
              libName={libName}
              moduleName={moduleName}
              className={className}
              functionType="Methods"
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
  }
}

export default withStyles(style, { withTheme: true })(
  connect(mapStateToProps)(ClassInfo)
);
