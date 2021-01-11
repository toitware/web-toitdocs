/* eslint-disable @typescript-eslint/camelcase */
// Copyright (C) 2020 Toitware ApS. All rights reserved.

import { Theme } from "@material-ui/core";
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
import { RouteComponentProps } from "react-router-dom";
import { ToitLibraries, ToitLibrary, ToitModule } from "../model/toitsdk";
import { getLibrary, getModule, librarySegmentsToName } from "../sdk";
import Functions from "./Functions";
import Classes from "./general/Classes";
import CodeBlock from "./general/codeblock/CodeBlock";
import Globals from "./Globals";

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

export interface ModuleInfoParams {
  libraryName: string;
  moduleName: string;
}

export interface ModuleInfoProps
  extends WithStyles<typeof styles>,
    RouteComponentProps<ModuleInfoParams> {
  libraries: ToitLibraries;
}

function removePrivate(props: ToitModule): ToitModule {
  const noPrivProps: ToitModule = {
    object_type: props.object_type,
    name: props.name,
    classes: props.classes.filter((elem) => elem.is_private === false),
    export_classes: props.export_classes.filter(
      (elem) => elem.is_private === false
    ),
    globals: props.globals,
    export_globals: props.export_globals,
    functions: props.functions.filter((elem) => elem.is_private === false),
    export_functions: props.export_functions,
  };

  return noPrivProps;
}

class ModuleInfoView extends Component<ModuleInfoProps> {
  componentDidMount(): void {
    const hashId = this.props.location.hash.substring(1);
    const element = document.getElementById(hashId);
    element?.scrollIntoView(true);
  }

  importPath(library: ToitLibrary, module: ToitModule): string {
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

  render(): JSX.Element {
    const { libraryName, moduleName } = this.props.match.params;
    const library = getLibrary(this.props.libraries, libraryName);
    const module = getModule(this.props.libraries, libraryName, moduleName);
    if (!library || !module) {
      return this.notFound(this.props.match.params.moduleName);
    }
    const noPrivModule = removePrivate(module);
    return (
      <>
        <div className={this.props.classes.heading}>
          <Typography component="h2" variant="h2">
            Module {module.name}
          </Typography>
        </div>
        <div className={this.props.classes.importingText}>
          <Typography>To use this module in your code:</Typography>
          <CodeBlock
            code={"import " + this.importPath(library, noPrivModule)}
          />
        </div>
        {noPrivModule.classes.length > 0 && (
          <Classes
            classes={noPrivModule.classes}
            libName={libraryName}
            moduleName={moduleName}
            title="Classes"
          />
        )}
        {noPrivModule.export_classes.length > 0 && (
          <Classes
            classes={noPrivModule.export_classes}
            libName={libraryName}
            moduleName={moduleName}
            title="Exported classes"
          />
        )}
        {noPrivModule.globals.length > 0 && (
          <Globals globals={noPrivModule.globals} title="Globals" />
        )}
        {noPrivModule.export_globals.length > 0 && (
          <Globals
            globals={noPrivModule.export_globals}
            title="Exported globals"
          />
        )}
        {noPrivModule.functions.length > 0 && (
          <Functions functions={noPrivModule.functions} title="Functions" />
        )}
        {noPrivModule.export_functions.length > 0 && (
          <Functions
            functions={noPrivModule.export_functions}
            title="Exported functions"
          />
        )}
      </>
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
