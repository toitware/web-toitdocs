// Copyright (C) 2020 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

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
import { viewMode, ViewMode } from "../../App";
import { libraryFrom } from "../../misc/util";
import { Libraries } from "../../model/model";
import Classes from "../doc/Classes";
import Functions from "../doc/Functions";
import Globals from "../doc/Globals";
import Toitdocs from "../doc/Toitdocs";
import CodeBlock from "../general/CodeBlock";

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
    const libName = this.props.match.params.libraryName;
    const library = libraryFrom(libName, this.props.libraries);
    if (!library) {
      return this.notFound(libName);
    }

    const importPath = libName.replace(/\//g, ".");
    let isCoreExported = false;
    let isCore = false;
    let showImportHelp = true;
    let isAbsoluteSDK = false;
    let isPackage = false;

    isAbsoluteSDK = libName === "@" || libName.startsWith("@");
    isPackage = libName === ".packages" || libName.startsWith(".packages/");

    switch (viewMode) {
      case ViewMode.SDK:
        isCoreExported = libName.startsWith("core/");
        const unexported = /^core\/.*_impl$/;
        if (isCoreExported && unexported.exec(libName)) {
          isCoreExported = false;
        }
        isCore = libName === "core";
        break;
      case ViewMode.Package:
        // Do nothing.
        break;
      case ViewMode.Folder:
        showImportHelp = false;
        break;
    }

    return (
      <>
        <div className={this.props.classes.heading}>
          <Typography component="h2" variant="h2">
            Library {library.name}
          </Typography>
        </div>
        {showImportHelp && (
          <div className={this.props.classes.importingText}>
            {isCore || isCoreExported ? (
              <Typography>
                This is {isCoreExported ? "exported from" : ""} the core
                library, which means you {isCore ? "usually" : ""} don&#39;t
                need to import it.
              </Typography>
            ) : isAbsoluteSDK ? (
              <Typography>This is the SDK branch.</Typography>
            ) : isPackage ? (
              <Typography>This is an imported packages branch.</Typography>
            ) : (
              <div>
                <Typography>To use this library in your code:</Typography>
                <CodeBlock code={"import " + importPath} />
              </div>
            )}
          </div>
        )}
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
        {Object.keys(library.mixins).length > 0 && (
          <Classes classes={Object.values(library.mixins)} title="Mixins" />
        )}
        {Object.keys(library.exportedMixins).length > 0 && (
          <Classes
            classes={Object.values(library.exportedMixins)}
            title="Exported mixins"
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
