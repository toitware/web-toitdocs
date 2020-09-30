// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import data from "../libraries.json";
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
  try {
  if (libName === modules.module.substring(0, modules.module.indexOf("."))) {
    path = modules.module.substring(0, modules.module.indexOf("."));
  } else {
    path =
      libName + "." + modules.module.substring(0, modules.module.indexOf("."));
  }
} catch (err){
  console.log("function importPath(): path not found")
}
  return path;
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    width: "60%",
    backgroundColor: "#9d9d9c11",
    color: "black",
  },
}));

function PrintClasses(props) {
  try {
    return(
    props.modules.sort((a, b) => a.class_name.localeCompare(b.class_name)).map((elem,index) => {
      return (
        <Box pt={1} pb={1} key={elem.class_name+"_"+index}>
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
    })
    )
    
  } catch (err) {
    return <div></div>;
  }
}

const ModuleInfo = ({ match }) => {
  const classes = useStyles();
  let propsOk = true;
  [data.libraries, match.params.libName, match.params.moduleName].forEach(
    (elem) => {
      if (elem === undefined || elem === null) {
        propsOk = false;
      }
    }
  );
  if (propsOk) {
    const {
      params: { libName, moduleName },
    } = match;

    const modules = data.libraries
      .find(({ lib_name }) => lib_name === libName)
      .lib_modules.find(({ module }) => module === moduleName);

    if ("module_classes" in modules && modules.module_classes !== undefined) {
      return (
        <div>
          <Grid container className={classes.root}>
            <Grid item xs={9}>
              <Box pt={2} pb={2}>
                <Typography component="h1" variant="h1">
                  module: {modules.module}
                </Typography>
              </Box>
              <Grid item>
                <Paper
                  elevation={0}
                  variant="outlined"
                  className={classes.paper}
                >
                  <strong>import</strong> {importPath(libName, modules)}
                </Paper>
              </Grid>
              <Box pt={2} pb={2}>
                <Box pt={1} pb={1}>
                  <Typography component="h2" variant="h2">
                    Classes
                  </Typography>
                </Box>
                <PrintClasses modules={modules.module_classes} libName={libName} moduleName={moduleName}/>
              </Box>
              <TopLevel value={modules.top_level} />
              <TopLevelExport value={modules.top_level} />
            </Grid>
            <Hidden xsDown>
              <Grid item xs={3}>
                <ModuleContentList value={modules} />
              </Grid>
            </Hidden>
          </Grid>
        </div>
      );
    }
    if ("export_classes" in modules && modules.export_classes !== undefined) {
      return (
        <div>
          <Grid container>
            <Grid item xs={9}>
              <Box pt={2} pb={2}>
                <Typography component="h1" variant="h1">
                  module: {modules.module}
                </Typography>
              </Box>
              <Grid item>
                <Paper
                  elevation={0}
                  variant="outlined"
                  className={classes.paper}
                >
                  <strong>import</strong> {importPath(libName, modules)}
                </Paper>
              </Grid>
              <Box pt={2} pb={2}>
                <Box pt={1} pb={1}>
                  <Typography component="h2" variant="h2">
                    Exported classes
                  </Typography>
                </Box>
                <PrintClasses modules={modules.export_classes} libName={libName} moduleName={moduleName}/>
              </Box>
              <TopLevel value={modules.top_level} />
              <TopLevelExport value={modules.top_level} />
            </Grid>
            <Hidden xsDown>
              <Grid item xs={3}>
                <ModuleContentList value={modules} />
              </Grid>
            </Hidden>
          </Grid>
        </div>
      );
    }
    if ("top_level" in modules && modules.top_level !== undefined) {
      return (
        <div>
          <Grid container>
            <Grid item xs={9}>
              <Box pt={2} pb={2}>
                <Typography component="h1" variant="h1">
                  module: {modules.module}
                </Typography>
              </Box>
              <Grid item>
                <Paper
                  elevation={0}
                  variant="outlined"
                  className={classes.paper}
                >
                  <strong>import</strong> {importPath(libName, modules)}
                </Paper>
              </Grid>
              <TopLevel value={modules.top_level} />
              <TopLevelExport value={modules.top_level} />
            </Grid>
            <Hidden xsDown>
              <Grid item xs={3}>
                <ModuleContentList value={modules} />
              </Grid>
            </Hidden>
          </Grid>
        </div>
      );
    } else {
      return (
        <div>
          Module: <strong>{modules.module}</strong>
        </div>
      );
    }
  } else {
    return (
      <Grid containerclassName={classes.root}>
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
};

export default ModuleInfo;
