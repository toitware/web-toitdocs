// Copyright (C) 2021 Toitware ApS. All rights reserved.

import { Theme, Typography } from "@material-ui/core";
import {
  createStyles,
  StyleRules,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import React from "react";
import { Link } from "react-router-dom";
import { libraryUrlFromRef } from "../../misc/util";
import {
  CATEGORY_FUNDAMENTAL,
  CATEGORY_JUST_THERE,
  CATEGORY_MISC,
  Libraries,
  Library,
} from "../../model/model";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    section: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(0.5),
    },
  });

export interface SummaryViewProps extends WithStyles<typeof styles> {
  libraries: Libraries;
}

class SummaryView extends React.PureComponent<SummaryViewProps> {
  render(): JSX.Element {
    const fundamentals: Array<Library> = [];
    const justThere: Array<Library> = [];
    const misc: Array<Library> = [];
    Object.values(this.props.libraries).forEach((lib) => {
      console.log(lib, lib.category);
      switch (lib.category) {
        case CATEGORY_FUNDAMENTAL:
          fundamentals.push(lib);
          break;
        case CATEGORY_JUST_THERE:
          justThere.push(lib);
          break;
        case CATEGORY_MISC:
          misc.push(lib);
          break;
      }
    });

    const renderSection = (
      array: Array<Library>,
      name?: string
    ): JSX.Element => {
      return (
        <div key={name}>
          {name && (
            <Typography variant="h4" className={this.props.classes.section}>
              {name}
            </Typography>
          )}
          {array.map((lib) => (
            <div key={lib.name}>
              <Link to={libraryUrlFromRef(lib.id)}>{lib.name}</Link>
            </div>
          ))}
        </div>
      );
    };

    // Shortcut if the viewer is used for non-core libraries in which
    // case there should only be misc libraries.
    if (fundamentals.length === 0 && justThere.length === 0) {
      return renderSection(misc);
    }
    return (
      <>
        {renderSection(fundamentals, "Fundamental")}
        {renderSection(justThere, "Framework")}
        {renderSection(misc, "Misc")}
      </>
    );
  }
}

export default withStyles(styles)(SummaryView);
