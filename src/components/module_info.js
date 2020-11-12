// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import ModuleContentList from "./module_content_list";
import Toitdocs from "./toitdoc_info";
import { FunctionsInModules } from "./methods";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { Hidden } from "@material-ui/core";
import { librarySegmentsToName, getLibrary } from "../sdk";

const style = (theme) => ({
  root: {
    width: "100%",
  },
});

function Globals(props) {
  return (
    <div>
      <Typography component="h3" variant="h3">
        Variables
      </Typography>
      {[]
        .concat(props.globals)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((global, index) => {
          return (
            <div key={`${global.name}_${index}`}>
              <code className="functionName">{global.name}</code>
            </div>
          );
        })}
    </div>
  );
}

function GlobalFunctions(props) {
    return (
      <div>
        <Typography component="h3" variant="h3">
          Functions
        </Typography>
        <FunctionsInModules functions={props.functions} />
      </div>
    );
}

function importPath(library, module) {
  const filename = module.name.substring(0, module.name.lastIndexOf("."));
  const libraryName = librarySegmentsToName(library.path);
  if (libraryName) {
    if (library.name === filename) {
      return libraryName;
    }
    return libraryName + "." + filename;
  }
  return filename;
}

function mapStateToProps(state, props) {
  const { sdk } = state;
  return {
    version: sdk.version,
    libraries: sdk.object.libraries,
    match: props.match,
  };
}
function PrintClasses(props) {
  try {
    return []
      .concat(props.module)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((elem, index) => {
        return (
          <Box pt={1} pb={1} key={elem.name + "_" + index}>
            <Link
              to={`/${props.libName}/${props.moduleName}/${elem.name}`}
            >
              <Typography component="h3" variant="h4">
                {elem.name}{" "}
              </Typography>
            </Link>
            <Toitdocs value={elem.toitdoc} />
          </Box>
        );
      });
  } catch (err) {
    return <div></div>;
  }
}

class ModuleInfo extends Component {
  render() {
    const { params: { libName, moduleName } } = this.props.match;
    const library = getLibrary(this.props.libraries, libName);
    const module = library && library.modules[moduleName];
    const classes = this.props.classes;
    if (module) {
      return (
        <div>
          <Grid container className={classes.root}>
            <Grid item xs={9}>
              <Box pt={2} pb={2}>
                <Typography component="h1" variant="h1">
                  module: {module.name}
                </Typography>
              </Box>
              <Grid item>
                <Paper
                  elevation={0}
                  variant="outlined"
                  className={classes.paper}
                >
                  <strong>import</strong> {importPath(library, module)}
                </Paper>
              </Grid>
              {module.classes.length > 0 &&
                <Box pt={2} pb={2}>
                  <Box pt={1} pb={1}>
                    <Typography component="h2" variant="h2">
                      Classes
                    </Typography>
                  </Box>
                  <PrintClasses
                    module={module.classes}
                    libName={libName}
                    moduleName={moduleName}
                  />
                </Box>
              }
              {module.export_classes.length > 0 &&
                <Box pt={2} pb={2}>
                  <Box pt={1} pb={1}>
                    <Typography component="h2" variant="h2">
                      Exported classes
                    </Typography>
                  </Box>
                  <PrintClasses
                    module={module.export_classes}
                    libName={libName}
                    moduleName={moduleName}
                  />
                </Box>
              }
              <Globals globals={module.globals} />
              <GlobalFunctions functions={module.functions} />
              <Typography component="h2" variant="h2">
                Exports
              </Typography>
              <Globals globals={module.export_globals} />
              <GlobalFunctions functions={module.export_functions} />
            </Grid>
            <Hidden xsDown>
              <Grid item xs={3}>
                <ModuleContentList value={module} />
              </Grid>
            </Hidden>
          </Grid>
        </div>
      );
    } else {
      return (
        <Grid containerclassName={this.props.classes.root}>
          <Grid item xs={9}>
            <Box pt={2} pb={2}>
              <Typography component="h1" variant="h1">
                ERROR:
                <p>Module not found</p>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      );
    }
  }
}

export default withStyles(style, { withTheme: true })(
  connect(mapStateToProps)(ModuleInfo)
);
