// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, { Component } from "react";
import { connect } from "react-redux";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { ArrowRightAlt } from "@material-ui/icons";
import Toitdocs from "./toitdoc_info";
import { Parameters } from "./parameters";
import { Type } from "./util";
import { getLibrary, RootState } from "../sdk";
import { ToitLibraries } from "../model/toitsdk";
import { match } from "react-router-dom";

const style = createStyles({
  root: {
    width: "100%",
  },
});

function mapStateToProps(
  state: RootState,
  props: FunctionInfoProps
): FunctionInfoProps {
  return {
    ...props,
    libraries: state.object?.libraries || {},
  };
}

interface FunctionInfoParams {
  libName: string;
  moduleName: string;
  className: string;
  functionType: string;
  functionName: string;
  index: string;
}

interface FunctionInfoProps extends WithStyles<typeof style> {
  libraries: ToitLibraries;
  match: match<FunctionInfoParams>;
}

class FunctionInfo extends Component<FunctionInfoProps> {
  render(): JSX.Element {
    const libName = this.props.match.params.libName;
    const moduleName = this.props.match.params.moduleName;
    const className = this.props.match.params.className;
    const functionType = this.props.match.params.functionType.toLowerCase();
    const functionName = this.props.match.params.functionName;
    const index = parseInt(this.props.match.params.index);

    let functionInfo = null;

    let pageTitle = "Unknown";
    const library = getLibrary(this.props.libraries, libName);
    const module = library && library.modules[moduleName];

    if (!module) {
      return <>Module not found</>;
    }

    let classInfo = module.classes.find(({ name }) => name === className);
    if (!classInfo) {
      classInfo = module.export_classes.find(({ name }) => name === className);
    }

    if (!classInfo) {
      return <>Class not found</>;
    }

    if (functionType === "constructors") {
      functionInfo = classInfo.structure.constructors[index];
      pageTitle = "Constructor of class: " + className;
    } else if (functionType === "factories") {
      functionInfo = classInfo.structure.factories[index];
      pageTitle = "Factory of class: " + className;
    } else if (functionType === "methods") {
      functionInfo = classInfo.structure.methods[index];
      pageTitle = "Function name: " + functionName;
    } else if (functionType === "statics") {
      functionInfo = classInfo.structure.statics[index];
      pageTitle = "Static name: " + functionName;
    }

    if (functionInfo) {
      return (
        <div className={this.props.classes.root}>
          <Grid container>
            <Grid item xs={12} sm={9}>
              <Box pt={2} pb={2}>
                <Typography variant="h1" component="h1">
                  {pageTitle}
                </Typography>
              </Box>
              <Box>
                <code>
                  <Parameters parameters={functionInfo.parameters} />
                </code>
                <ArrowRightAlt
                  style={{
                    verticalAlign: "middle",
                    display: "inline-flex",
                  }}
                />
                <Type type={functionInfo.return_type}></Type>
              </Box>
              <Box>
                <Toitdocs value={functionInfo.toitdoc} />
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
