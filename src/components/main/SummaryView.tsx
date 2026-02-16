// Copyright (C) 2021 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import { Theme, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { makeStyles } from "tss-react/mui";
import { libraryUrlFromRef } from "../../misc/util";
import {
    CATEGORY_FUNDAMENTAL,
    CATEGORY_JUST_THERE,
    CATEGORY_MISC,
    Libraries,
    Library,
} from "../../model/model";
import Toitdocs from "../doc/Toitdocs";

const useStyles = makeStyles()((theme: Theme) => ({
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
}));

export interface SummaryViewProps {
  libraries: Libraries;
}

export default function SummaryView(props: SummaryViewProps): JSX.Element {
  const { classes } = useStyles();

  const fundamentals: Array<Library> = [];
  const justThere: Array<Library> = [];
  const misc: Array<Library> = [];
  Object.values(props.libraries).forEach((lib) => {
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
