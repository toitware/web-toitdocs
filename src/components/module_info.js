// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import ModuleContentList from "./module_content_list";
import Toitdocs from "./toitdoc_info";
import { MethodsInModules } from "./methods";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { Hidden } from "@material-ui/core";

const style = (theme) => ({
  root: {
    width: "100%",
  },
});

function Globals(props) {
  if (props.value !== undefined) {
    return (
      <div>
        <Typography component="h3" variant="h3">
          Variables:
        </Typography>
        {[]
          .concat(props.value)
          .sort((a, b) => a.global_name.localeCompare(b.global_name))
          .map((globals, index) => {
            return (
              <div key={`${globals.global_name}_${index}`}>
                <code className="functionName">{globals.global_name}</code>
              </div>
            );
          })}
      </div>
    );
  } else {
    return null;
  }
}

function GlobalFunctions(props) {
  if (props.value !== undefined) {
    return (
      <div>
        <Typography component="h3" variant="h3">
          Functions:
        </Typography>
        <MethodsInModules value={props.value} />
      </div>
    );
  } else {
    return null;
  }
}

function TopLevel(props) {
  if (props.value !== undefined) {
    return (
      <div>
        <Typography component="h2" variant="h2"></Typography>
        <Globals value={props.value.module_globals} />
        <GlobalFunctions value={props.value} />
      </div>
    );
  } else {
    return null;
  }
}

function TopLevelExport(props) {
  try {
    if (
      props.value.export_globals !== undefined ||
      props.value.export_functions !== undefined
    ) {
      return (
        <div>
          <Typography component="h2" variant="h2">
            Exports
          </Typography>
          <Globals value={props.value.export_globals} />
          <GlobalFunctions value={props.value.export_functions} />
        </div>
      );
    } else {
      return null;
    }
  } catch {
    return null;
  }
}

function importPath(libName, modules) {
  var path = "";
  try {
    if (libName === modules.module.substring(0, modules.module.indexOf("."))) {
      path = modules.module.substring(0, modules.module.indexOf("."));
    } else {
      path =
        libName +
        "." +
        modules.module.substring(0, modules.module.indexOf("."));
    }
  } catch (err) {
    console.log("function importPath(): path not found");
  }
  return path;
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
      .sort((a, b) => a.class_name.localeCompare(b.class_name))
      .map((elem, index) => {
        return (
          <Box pt={1} pb={1} key={elem.class_name + "_" + index}>
            <Link
              to={`/${props.libName}/${props.moduleName}/${elem.class_name}`}
            >
              <Typography component="h3" variant="h4">
                {elem.class_name}{" "}
              </Typography>
            </Link>
            <Toitdocs value={elem.class_toitdoc} />
          </Box>
        );
      });
  } catch (err) {
    return <div></div>;
  }
}

class ModuleInfo extends Component {
  render() {
    let propsOk = true;
    [
      this.props.libraries,
      this.props.match.params.libName,
      this.props.match.params.moduleName,
    ].forEach((elem) => {
      if (elem === undefined || elem === null) {
        propsOk = false;
      }
    });
    if (propsOk) {
      const {
        params: { libName, moduleName },
      } = this.props.match;
      const library = this.props.libraries.find(
        ({ lib_name }) => lib_name === libName
      );
      const module = library.lib_modules.find(
        ({ module }) => module === moduleName
      );
      const classes = this.props.classes;
      if ("module_classes" in module && module.module_classes !== undefined) {
        return (
          <div>
            <Grid container className={classes.root}>
              <Grid item xs={9}>
                <Box pt={2} pb={2}>
                  <Typography component="h1" variant="h1">
                    module: {module.module}
                  </Typography>
                </Box>
                <Grid item>
                  <Paper
                    elevation={0}
                    variant="outlined"
                    className={classes.paper}
                  >
                    <strong>import</strong> {importPath(libName, module)}
                  </Paper>
                </Grid>
                <Box pt={2} pb={2}>
                  <Box pt={1} pb={1}>
                    <Typography component="h2" variant="h2">
                      Classes
                    </Typography>
                  </Box>
                  <PrintClasses
                    module={module.module_classes}
                    libName={libName}
                    moduleName={moduleName}
                  />
                </Box>
                <TopLevel value={module.top_level} />
                <TopLevelExport value={module.top_level} />
              </Grid>
              <Hidden xsDown>
                <Grid item xs={3}>
                  <ModuleContentList value={module} />
                </Grid>
              </Hidden>
            </Grid>
          </div>
        );
      }
      if ("export_classes" in module && module.export_classes !== undefined) {
        return (
          <div>
            <Grid container>
              <Grid item xs={9}>
                <Box pt={2} pb={2}>
                  <Typography component="h1" variant="h1">
                    module: {module.module}
                  </Typography>
                </Box>
                <Grid item>
                  <Paper
                    elevation={0}
                    variant="outlined"
                    className={classes.paper}
                  >
                    <strong>import</strong> {importPath(libName, module)}
                  </Paper>
                </Grid>
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
                <TopLevel value={module.top_level} />
                <TopLevelExport value={module.top_level} />
              </Grid>
              <Hidden xsDown>
                <Grid item xs={3}>
                  <ModuleContentList value={module} />
                </Grid>
              </Hidden>
            </Grid>
          </div>
        );
      }
      if ("top_level" in module && module.top_level !== undefined) {
        return (
          <div>
            <Grid container>
              <Grid item xs={9}>
                <Box pt={2} pb={2}>
                  <Typography component="h1" variant="h1">
                    module: {module.module}
                  </Typography>
                </Box>
                <Grid item>
                  <Paper
                    elevation={0}
                    variant="outlined"
                    className={classes.paper}
                  >
                    <strong>import</strong> {importPath(libName, module)}
                  </Paper>
                </Grid>
                <TopLevel value={module.top_level} />
                <TopLevelExport value={module.top_level} />
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
          <div>
            Module: <strong>{module.module}</strong>
          </div>
        );
      }
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
