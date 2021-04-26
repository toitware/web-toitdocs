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
import { libraryFrom } from "../../misc/util";
import { Libraries } from "../../model/model";
import CodeBlock from "../general/CodeBlock";
import Classes from "../sdk/Classes";
import Functions from "../sdk/Functions";
import Globals from "../sdk/Globals";
import Toitdocs from "../sdk/Toitdocs";

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

export interface LibraryInfoParams {
  libraryName: string;
}

export interface LibraryInfoProps
  extends WithStyles<typeof styles>,
    RouteComponentProps<LibraryInfoParams> {
  libraries: Libraries;
}

class LibraryInfoView extends Component<LibraryInfoProps> {
  componentDidMount(): void {
    const hashId = this.props.location.hash.substring(1);
    const element = document.getElementById(hashId);
    element?.scrollIntoView(true);
  }

  render(): JSX.Element {
    const library = libraryFrom(
      this.props.match.params.libraryName,
      this.props.libraries
    );
    if (!library) {
      return this.notFound(this.props.match.params.libraryName);
    }

    const importPath = this.props.match.params.libraryName.replace(/\//g, ".");

    return (
      <>
        <div className={this.props.classes.heading}>
          <Typography component="h2" variant="h2">
            Library {library.name}
          </Typography>
        </div>
        <div className={this.props.classes.importingText}>
          <Typography>To use this library in your code:</Typography>
          <CodeBlock code={"import " + importPath} />
        </div>
        {library.toitdoc && <Toitdocs value={library.toitdoc} />}
        {Object.keys(library.interfaces).length > 0 && (
          <Classes
            classes={Object.values(library.interfaces)}
            title="Interfaces"
          />
        )}
        {Object.keys(library.exportedInterfaces).length > 0 && (
          <Classes
            classes={Object.values(library.exportedInterfaces)}
            title="Exported interfaces"
          />
        )}
        {Object.keys(library.classes).length > 0 && (
          <Classes classes={Object.values(library.classes)} title="Classes" />
        )}
        {Object.keys(library.exportedClasses).length > 0 && (
          <Classes
            classes={Object.values(library.exportedClasses)}
            title="Exported classes"
          />
        )}
        {library.globals.length > 0 && (
          <Globals globals={library.globals} title="Globals" />
        )}
        {library.exportedGlobals.length > 0 && (
          <Globals globals={library.exportedGlobals} title="Exported globals" />
        )}
        {library.functions.length > 0 && (
          <Functions functions={library.functions} title="Functions" />
        )}
        {library.exportedFunctions.length > 0 && (
          <Functions
            functions={library.exportedFunctions}
            title="Exported functions"
          />
        )}
      </>
    );
  }

  notFound(libraryName: string): JSX.Element {
    return (
      <Typography variant="h4">
        {"Error: Library " + libraryName + " not found"}
      </Typography>
    );
  }
}

export default withStyles(styles)(LibraryInfoView);
