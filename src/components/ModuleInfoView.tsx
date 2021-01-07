// Copyright (C) 2020 Toitware ApS. All rights reserved.

import { Hidden, Theme } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import {
  createStyles,
  StyleRules,
  WithStyles,
  withStyles,
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { Component } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import {
  ToitClass,
  ToitFunction,
  ToitGlobal,
  ToitLibraries,
  ToitLibrary,
  ToitModule,
} from "../model/toitsdk";
import { getLibrary, getModule, librarySegmentsToName } from "../sdk";
import Functions from "./Functions";
import { CodeBlock } from "./general/codeblock/CodeBlock";
import ModuleContentList from "./ModuleContentList";
import Toitdocs from "./ToitdocInfo";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    root: {
      width: "100%",
    },
    importingText: {
      marginBottom: theme.spacing(2),
    },
    heading: {
      marginBottom: theme.spacing(3),
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
  return <Functions functions={props.functions} title="Functions" />;
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

export interface ModuleInfoParams {
  libraryName: string;
  moduleName: string;
}

export interface ModuleInfoProps
  extends WithStyles<typeof styles>,
    RouteComponentProps<ModuleInfoParams> {
  libraries: ToitLibraries;
}

class ModuleInfoView extends Component<ModuleInfoProps> {
  componentDidMount(): void {
    const hashId = this.props.location.hash.substring(1);
    const element = document.getElementById(hashId);
    element?.scrollIntoView(true);
  }

  render(): JSX.Element {
    const { libraryName, moduleName } = this.props.match.params;
    const library = getLibrary(this.props.libraries, libraryName);
    const module = getModule(this.props.libraries, libraryName, moduleName);

    if (!library || !module) {
      return this.notFound(this.props.match.params.moduleName);
    }

    return (
      <div>
        <Grid container className={this.props.classes.root}>
          <Grid item xs={9}>
            <Box pt={2} pb={2} className={this.props.classes.heading}>
              <Typography component="h2" variant="h2">
                module: {module.name}
              </Typography>
            </Box>
            <Grid item className={this.props.classes.importingText}>
              <Typography variant="body1">
                To use this module in your code:
              </Typography>
            </Grid>
            <Grid item>
              <CodeBlock code={"import " + importPath(library, module)} />
            </Grid>
            {module.classes.length > 0 && (
              <Box pt={2} pb={2}>
                <Box pt={1} pb={1}>
                  <Typography component="h3" variant="h3">
                    Classes
                  </Typography>
                </Box>
                <PrintClasses
                  libName={libraryName}
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
                  libName={libraryName}
                  moduleName={moduleName}
                />
              </Box>
            )}
            {module.globals.length > 0 && <Globals globals={module.globals} />}
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
  }

  notFound(name: string): JSX.Element {
    return (
      <Grid container className={this.props.classes.root}>
        <Grid item xs={9}>
          <Box pt={2} pb={2}>
            <Typography component="h2" variant="h2">
              ERROR:
              <p>Module {name} not found</p>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(ModuleInfoView);
