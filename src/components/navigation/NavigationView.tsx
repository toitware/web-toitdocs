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
import { libraryUrlFromRef, topLevelRefToId } from "../../misc/util";
import { Libraries, Library } from "../../model/model";
import { ViewMode, viewMode } from "../../App";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    heading: {
      marginBottom: theme.spacing(3),
    },
    subLibraries: {
      paddingLeft: theme.spacing(2),
    },
    openLibrary: {
      fontWeight: "bold",
    },
  });

export interface NavigationParams {
  libraryName: string;
}

export interface NavigationProps
  extends WithStyles<typeof styles>,
    RouteComponentProps<NavigationParams> {
  libraries: Libraries;
}

class NavigationView extends Component<NavigationProps> {
  render(): JSX.Element {
    analytics.page(this.props.location.pathname);
    if (!this.props.match.params.libraryName) return <></>;
    return (
      <>
        <div className={this.props.classes.heading}>
          <Typography variant="h5">Libraries</Typography>
        </div>
        {this.showLibrariesMenu(this.props.match.params.libraryName)}
      </>
    );
  }

  showLibrariesMenu(openLibrary: string): JSX.Element | JSX.Element[] {
    // For SDK mode show all libraries.
    if (viewMode === ViewMode.SDK) {
      return Object.values(this.props.libraries)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((subLibrary) => this.showLibrary(subLibrary, openLibrary));
    }

    const rootLibrary = this.props.match.params.libraryName.split("/")[0];
    const library = this.props.libraries[rootLibrary];
    if (!library) return <></>;
    return this.showLibrary(library, this.props.match.params.libraryName);
  }

  showLibrary(library: Library, openLibrary: string): JSX.Element {
    const showSubLibraries = openLibrary?.split("/")[0] === library.name;
    const openSubLibrary = openLibrary?.split("/").slice(1).join("/");
    return (
      <div key={topLevelRefToId(library.id)}>
        <Link
          to={libraryUrlFromRef(library.id)}
          className={showSubLibraries ? this.props.classes.openLibrary : ""}
        >
          {library.name}
        </Link>
        {showSubLibraries && (
          <div className={this.props.classes.subLibraries}>
            {Object.values(library.libraries)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((subLibrary) =>
                this.showLibrary(subLibrary, openSubLibrary)
              )}
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(NavigationView);
