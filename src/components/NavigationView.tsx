import {
  createStyles,
  StyleRules,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import React, { Component } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { moduleUrlFromRef, topLevelRefToId } from "../misc/util";
import { Module, Modules } from "../model/model";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    heading: {
      marginBottom: theme.spacing(3),
    },
    subModules: {
      paddingLeft: theme.spacing(2),
    },
  });

export interface NavigationParams {
  moduleName: string;
}

export interface NavigationProps
  extends WithStyles<typeof styles>,
    RouteComponentProps<NavigationParams> {
  modules: Modules;
}

class NavigationView extends Component<NavigationProps> {
  render(): JSX.Element {
    return (
      <>
        <div className={this.props.classes.heading}>
          <Typography variant="h5">Modules</Typography>
        </div>
        {Object.values(this.props.modules)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((module) =>
            this.showModule(module, this.props.match.params.moduleName)
          )}
      </>
    );
  }

  showModule(module: Module, openModule?: string): JSX.Element {
    const showSubModules = openModule?.startsWith(module.name);
    const openSubModule = openModule?.split("/").slice(1).join("/");

    return (
      <div key={topLevelRefToId(module.id)}>
        <Link to={moduleUrlFromRef(module.id)}>{module.name}</Link>
        {showSubModules && (
          <div className={this.props.classes.subModules}>
            {Object.values(module.modules)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((subModule) => this.showModule(subModule, openSubModule))}
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(NavigationView);
