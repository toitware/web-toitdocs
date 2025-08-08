// Copyright (C) 2021 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

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
import Toitdocs from "../doc/Toitdocs";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    section: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(0.5),
    },
    libList: {
      "column-count": 2,
      "column-gap": theme.spacing(2),
    },
    libEntry: {
      paddingBottom: theme.spacing(1),
      "break-inside": "avoid-column",
    },
    toitdoc: {
      paddingTop: theme.spacing(0.3),
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

    const classes = this.props.classes;

    const renderSection = (
      array: Array<Library>,
      name?: string,
    ): JSX.Element => {
      return (
        <div key={name}>
          {name && (
            <Typography variant="h4" className={classes.section}>
              {name}
            </Typography>
          )}
          <div className={classes.libList}>
            {array.map((lib) => (
              <div key={lib.name} className={classes.libEntry}>
                <Link to={libraryUrlFromRef(lib.id)}>{lib.name}</Link>
                {lib.toitdoc && (
                  <div className={classes.toitdoc}>
                    <Toitdocs value={lib.toitdoc} headerOnly={true} />
                  </div>
                )}
              </div>
            ))}
          </div>
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
