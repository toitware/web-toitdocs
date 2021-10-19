import { createStyles, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { Link } from "react-router-dom";
import { libraryUrlFromRef, topLevelRefToId } from "../../misc/util";
import { Library } from "../../model/model";
import { NavigationParams } from "./NavigationView";

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
  navigationParams: NavigationParams;
};

const LibraryNavigation: React.FC<LibraryNavigationProps> = ({
  library,
  navigationParams,
}: LibraryNavigationProps) => {
  const classes = useStyles();
  const openLibrary = navigationParams.libraryName;
  const showSubLibraries = openLibrary?.split("/")[0] === library.name;
  // const openSubLibrary = openLibrary?.split("/").slice(1).join("/");
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
                navigationParams={navigationParams}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default LibraryNavigation;