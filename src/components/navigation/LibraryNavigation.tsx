// Copyright (C) 2024 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import { createStyles, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { Link } from "react-router-dom";
import { libraryUrlFromRef, topLevelRefToId } from "../../misc/util";
import { Library } from "../../model/model";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    subLibraries: {
      paddingLeft: theme.spacing(1),
    },
    openLibrary: {
      color: `${theme.palette.primary.main} !important`,
    },
  })
);

export type LibraryNavigationProps = {
  library: Library;
  openLibrary: string;
};

const LibraryNavigation: React.FC<LibraryNavigationProps> = ({
  library,
  openLibrary,
}: LibraryNavigationProps) => {
  const classes = useStyles();
  const showSubLibraries = openLibrary?.split("/")[0] === library.name;
  const openSubLibrary = openLibrary?.split("/").slice(1).join("/");
  return (
    <div key={topLevelRefToId(library.id)}>
      <Link
        to={libraryUrlFromRef(library.id)}
        className={showSubLibraries ? classes.openLibrary : ""}
      >
        {library.name}
      </Link>
      {showSubLibraries && (
        <div className={classes.subLibraries}>
          {Object.values(library.libraries)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((subLibrary) => (
              <LibraryNavigation
                key={subLibrary.id.name}
                library={subLibrary}
                openLibrary={openSubLibrary}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default LibraryNavigation;
