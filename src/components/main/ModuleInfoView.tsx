// Copyright (C) 2020 Toitware ApS. All rights reserved.

import { Theme } from "@material-ui/core";
import {
  createStyles,
  StyleRules,
  WithStyles,
  withStyles,
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { moduleFrom } from "../../misc/util";
import { Modules } from "../../model/model";
import CodeBlock from "../general/CodeBlock";
import Classes from "../sdk/Classes";
import Functions from "../sdk/Functions";
import Globals from "../sdk/Globals";

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
  moduleName: string;
}

export interface ModuleInfoProps
  extends WithStyles<typeof styles>,
    RouteComponentProps<ModuleInfoParams> {
  modules: Modules;
}

class ModuleInfoView extends Component<ModuleInfoProps> {
  componentDidMount(): void {
    const hashId = this.props.location.hash.substring(1);
    const element = document.getElementById(hashId);
    element?.scrollIntoView(true);
  }

  render(): JSX.Element {
    const module = moduleFrom(
      this.props.match.params.moduleName,
      this.props.modules
    );
    if (!module) {
      return this.notFound(this.props.match.params.moduleName);
    }

    const importPath = this.props.match.params.moduleName.replaceAll("/", ".");

    return (
      <>
        <div className={this.props.classes.heading}>
          <Typography component="h2" variant="h2">
            Module {module.name}
          </Typography>
        </div>
        <div className={this.props.classes.importingText}>
          <Typography>To use this module in your code:</Typography>
          <CodeBlock code={"import " + importPath} />
        </div>
        {Object.keys(module.classes).length > 0 && (
          <Classes classes={Object.values(module.classes)} title="Classes" />
        )}
        {Object.keys(module.exportedClasses).length > 0 && (
          <Classes
            classes={Object.values(module.exportedClasses)}
            title="Exported classes"
          />
        )}
        {module.globals.length > 0 && (
          <Globals globals={module.globals} title="Globals" />
        )}
        {module.exportedGlobals.length > 0 && (
          <Globals globals={module.exportedGlobals} title="Exported globals" />
        )}
        {module.functions.length > 0 && (
          <Functions functions={module.functions} title="Functions" />
        )}
        {module.exportedFunctions.length > 0 && (
          <Functions
            functions={module.exportedFunctions}
            title="Exported functions"
          />
        )}
      </>
    );
  }

  notFound(moduleName: string): JSX.Element {
    return (
      <Typography variant="h4">
        {"Error: Module " + moduleName + " not found"}
      </Typography>
    );
  }
}

export default withStyles(styles)(ModuleInfoView);
