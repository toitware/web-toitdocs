// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, {Component} from "react";
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
  if (libName === modules.module.substring(0, modules.module.indexOf("."))) {
    path = modules.module.substring(0, modules.module.indexOf("."));
  } else {
    path =
      libName + "." + modules.module.substring(0, modules.module.indexOf("."));
  }
  return path;
}

const style = (theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    width: "60%",
    backgroundColor: "#9d9d9c11",
    color: "black",
  },
});

function mapStateToProps(state, props) {
  const { sdk } = state
  return { version: sdk.version, libraries: sdk.object.libraries, match: props.match }
}

class ModuleInfo extends Component {
  render() {
    const {
      params: { libName, moduleName },
    } = this.props.match;

    const library = this.props.libraries
      .find(({ lib_name }) => lib_name === libName)
    const module = library.lib_modules.find(({ module }) => module === moduleName);
    const classes = this.props.classes;

    if ("module_classes" in module && module.module_classes !== undefined) {
      return (
        <div>
          <Grid container  className={classes.root}>
            <Grid item xs={9}>
              <Box pt={2} pb={2}>
                <Typography component="h1" variant="h1">
                  module: {module.module}
                </Typography>
              </Box>
              <Grid item>
                <Paper elevation={0} variant="outlined" className={classes.paper}>
                  <strong>import</strong> {importPath(libName, module)}
                </Paper>
              </Grid>
              <Box pt={2} pb={2}>
                <Box pt={1} pb={1}>
                  <Typography component="h2" variant="h2">
                    Classes
                  </Typography>
                </Box>
                {[]
                  .concat(module.module_classes)
                  .sort((a, b) => a.class_name.localeCompare(b.class_name))
                  .map((index) => {
                    return (
                      <Box pt={1} pb={1} key={index.class_name}>
                        <Link
                          to={`/${libName}/${moduleName}/${index.class_name}`}
                        >
                          <Typography component="h3" variant="h4">
                            {index.class_name}{" "}
                          </Typography>
                        </Link>
                        <Toitdocs value={index.class_toitdoc} />
                      </Box>
                    );
                  })}
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
                <Paper elevation={0} variant="outlined" className={classes.paper}>
                  <strong>import</strong> {importPath(libName, module)}
                </Paper>
              </Grid>
              <Box pt={2} pb={2}>
                <Box pt={1} pb={1}>
                  <Typography component="h2" variant="h2">
                    Exported classes
                  </Typography>
                </Box>
                {[]
                  .concat(module.export_classes)
                  .sort((a, b) => a.class_name.localeCompare(b.class_name))
                  .map((index) => {
                    return (
                      <Box pt={1} pb={1} key={index.class_name}>
                        <Link to={`/${index.exported_from}/${index.class_name}`}>
                          <Typography component="h3" variant="h3">
                            {index.class_name}{" "}
                          </Typography>
                        </Link>
                        <Toitdocs value={index.class_toitdoc} />
                      </Box>
                    );
                  })}
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
          <Grid container >
            <Grid item xs={9}>
              <Box pt={2} pb={2}>
                <Typography component="h1" variant="h1">
                  module: {module.module}
                </Typography>
              </Box>
              <Grid item>
                <Paper elevation={0} variant="outlined" className={classes.paper}>
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
  }
};

export default withStyles(style, {withTheme: true})(connect(mapStateToProps)(ModuleInfo));
