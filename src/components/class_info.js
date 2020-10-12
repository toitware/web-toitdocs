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
import { CompassCalibrationOutlined } from "@material-ui/icons";

function Extends({ extendText, extendURL }) {
  if (
    [undefined, null].includes(extendText) ||
    [undefined, null].includes(extendURL)
  ) {
    console.log("function Extends(): nothing found");
    return null;
  } else {
    return (
      <div>
        <Link to={`/${extendURL}/${extendText}`}> extends {extendText}</Link>
      </div>
    );
  }
}

function Constructors(props) {
  let propsOk = true;
  try {
    [props.value, props.libName, props.moduleName, props.className].forEach(
      (elem) => {
        if (elem === undefined || elem === null) {
          propsOk = false;
        }
      }
    );
    if (propsOk) {
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
      console.log("function Constructors(): no Constructors found");
      return null;
    }
  } catch (error) {
    console.log("function Constructors(): Function failed");
    return null;
  }
}

function Statics(props) {
  let propsOk = true;
  try {
    [props.value, props.libName, props.moduleName, props.className].forEach(
      (elem) => {
        if (elem === undefined || elem === null) {
          propsOk = false;
        }
      }
    );
    if (propsOk) {
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
      console.log("function Statics(): no Statics found");
      return null;
    }
  } catch (err) {
    console.log("function Statics(): Failure appeared");
    return null;
  }
}

function Factories(props) {
  let propsOk = true;
  try {
    [props.value, props.libName, props.moduleName, props.className].forEach(
      (elem) => {
        if (elem === undefined || elem === null) {
          propsOk = false;
        }
      }
    );
    if (propsOk) {
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
  } catch (err) {
    console.log("function Factories(): Failure appeared");
    return null;
  }
}

function Fields(props) {
  let propsOk = false;
  let fields;
  try {
    fields = props.value.fields;
    if (fields !== undefined && fields !== null) {
      propsOk = true;
    }
  } catch {
    return null;
  }
  if (propsOk) {
    propsOk = false;
    return (
      <div>
        <Typography variant="h3" component="h3">
          Fields:
        </Typography>
        {fields.map((elem, index) => {
          propsOk = true;
          [elem.field_name, elem.field_type].forEach((elem) => {
            if (elem === undefined || elem === null) {
              propsOk = false;
            }
          });
          if (propsOk) {
            return (
              <div key={elem.field_name}>
                {/* TODO: link to field type */}
                <div className="functionName">
                  <strong>{elem.field_name}</strong>/{elem.field_type}
                </div>
                <Toitdocs value={elem.field_toitdoc} />
              </div>
            );
          } else {
            console.log("function Fields(): No fields found");
            return <div></div>;
          }
        })}
      </div>
    );
  } else {
    return null;
  }
}
const style = (theme) => ({
  root: {
    width: "100%",
  },
});

function Members(props) {
  let propsOk = true;
  try {
    [props.value, props.libName, props.moduleName, props.className].forEach(
      (elem) => {
        if (elem === undefined || elem === null) {
          propsOk = false;
        }
      }
    );
  } catch {
    propsOk = false;
  }

  if (propsOk) {
    return (
      <div>
        <Typography variant="h2" component="h2">
          Members:
        </Typography>
        <Fields value={props.value} />
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
    return <div></div>;
  }
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
  render() {
    const classes = this.props.classes;
    const {
      params: { libName, moduleName, className },
    } = this.props.match;

    var module_info = this.props.libraries
      .find(({ lib_name }) => lib_name === libName)
      .lib_modules.find(({ module }) => module === moduleName);

    var class_info;

    if (module_info.module_classes !== undefined) {
      class_info = module_info.module_classes.find(
        ({ class_name }) => class_name === className
      );
    } else if (module_info.export_classes !== undefined) {
      class_info = module_info.export_classes.find(
        ({ class_name }) => class_name === className
      );
    }

    if (class_info !== undefined) {
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
                <Statics
                  value={class_info.class_structure.statics}
                  libName={libName}
                  moduleName={moduleName}
                  className={className}
                  functionType="Statics"
                />
              <Members
                value={class_info.class_structure.members}
                libName={libName}
                moduleName={moduleName}
                className={className}
                functionType="Members"
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
    } else {
      return (
        <Grid container>
          <Grid item xs={12} sm={9}>
            <Typography variant="h1" component="h1">
              Class: {className} not found!
            </Typography>
          </Grid>
        </Grid>
      );
    }
  }
}

export default withStyles(style, { withTheme: true })(
  connect(mapStateToProps)(ClassInfo)
);
