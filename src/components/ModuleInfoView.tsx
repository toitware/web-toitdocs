// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, { Component } from "react";
import { connect } from "react-redux";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import { Link, match } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import ModuleContentList from "./module_content_list";
import Toitdocs from "./toitdoc_info";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { Hidden } from "@material-ui/core";
import { librarySegmentsToName, getLibrary, RootState } from "../sdk";
import {
  ToitClass,
  ToitFunction,
  ToitGlobal,
  ToitLibraries,
  ToitLibrary,
  ToitModule,
} from "../model/toitsdk";
import Methods from "./Methods";

const style = createStyles({
  root: {
    width: "100%",
  },
});

function Globals(props: { globals: ToitGlobal[] }): JSX.Element {
  return (
    <div>
      <Box pt={2} pb={2}>
        <Box pt={1} pb={1}>
          <Typography component="h3" variant="h3">
            Globals
          </Typography>
        </Box>
      </Box>
      {props.globals
        .concat([])
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

function GlobalFunctions(props: { functions: ToitFunction[] }): JSX.Element {
  return (
    <div>
      <Box pt={2} pb={2}>
        <Box pt={1} pb={1}>
          <Typography component="h3" variant="h3">
            Functions
          </Typography>
        </Box>
      </Box>
      <Methods functions={props.functions} />
    </div>
  );
}

function ExportFunctions(): JSX.Element {
  return (
    <div>
      <Box pt={2} pb={2}>
        <Box pt={1} pb={1}>
          <Typography component="h3" variant="h3">
            Exported Functions
          </Typography>
        </Box>
      </Box>
    </div>
  );
}

function ExportGlobals(): JSX.Element {
  return (
    <div>
      <Box pt={2} pb={2}>
        <Box pt={1} pb={1}>
          <Typography component="h3" variant="h3">
            Exported Globals
          </Typography>
        </Box>
      </Box>
    </div>
  );
}

function importPath(library: ToitLibrary, module: ToitModule): string {
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

function PrintClasses(props: {
  classes: ToitClass[];
  libName: string;
  moduleName: string;
}): JSX.Element | null {
  try {
    return (
      <>
        {props.classes
          .concat([])
          .sort((a: ToitClass, b: ToitClass) => a.name.localeCompare(b.name))
          .map((elem, index) => {
            return (
              <Box pt={1} pb={1} key={elem.name + "_" + index}>
                <Link to={`/${props.libName}/${props.moduleName}/${elem.name}`}>
                  <Typography component="h4" variant="h4">
                    {elem.name}{" "}
                  </Typography>
                </Link>
                <Toitdocs value={elem.toitdoc} />
              </Box>
            );
          })}
      </>
    );
  } catch (err) {
    return null;
  }
}

function mapStateToProps(
  state: RootState,
  props: ModuleInfoProps
): ModuleInfoProps {
  return {
    ...props,
    libraries: state.sdk.object?.libraries || {},
  };
}

interface ModuleInfoParams {
  libName: string;
  moduleName: string;
}

interface ModuleInfoProps extends WithStyles<typeof style> {
  libraries: ToitLibraries;
  match: match<ModuleInfoParams>;
  location: Location;
}

class ModuleInfo extends Component<ModuleInfoProps> {
  componentDidMount(): void {
    const hashId = this.props.location.hash.substring(1);
    const element = document.getElementById(hashId);
    element?.scrollIntoView(true);
  }

  render(): JSX.Element {
    const libName = this.props.match.params.libName;
    const moduleName = this.props.match.params.moduleName;
    const library = getLibrary(this.props.libraries, libName);
    const module = library && library.modules[moduleName];
    if (module) {
      return (
        <div>
          <Grid container className={this.props.classes.root}>
            <Grid item xs={9}>
              <Box pt={2} pb={2}>
                <Typography component="h2" variant="h2">
                  module: {module.name}
                </Typography>
              </Box>
              <Grid item>
                <Paper elevation={0} variant="outlined">
                  <strong>import</strong> {importPath(library, module)}
                </Paper>
              </Grid>
              {module.classes.length > 0 && (
                <Box pt={2} pb={2}>
                  <Box pt={1} pb={1}>
                    <Typography component="h3" variant="h3">
                      Classes
                    </Typography>
                  </Box>
                  <PrintClasses
                    libName={libName}
                    moduleName={moduleName}
                    classes={module.classes}
                  />
                </Box>
              )}
              {module.export_classes.length > 0 && (
                <Box pt={2} pb={2}>
                  <Box pt={1} pb={1}>
                    <Typography component="h3" variant="h3">
                      Exported classes
                    </Typography>
                  </Box>
                  <PrintClasses
                    classes={module.export_classes}
                    libName={libName}
                    moduleName={moduleName}
                  />
                </Box>
              )}
              {module.globals.length > 0 && (
                <Globals globals={module.globals} />
              )}
              {module.export_globals.length > 0 && <ExportGlobals />}
              {module.functions.length > 0 && (
                <GlobalFunctions functions={module.functions} />
              )}
              {module.export_functions.length > 0 && <ExportFunctions />}
            </Grid>
            <Hidden xsDown>
              <Grid item xs={3}>
                <ModuleContentList module={module} />
              </Grid>
            </Hidden>
          </Grid>
        </div>
      );
    } else {
      return (
        <Grid container className={this.props.classes.root}>
          <Grid item xs={9}>
            <Box pt={2} pb={2}>
              <Typography component="h2" variant="h2">
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

export default connect(mapStateToProps)(withStyles(style)(ModuleInfo));
