// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React from "react";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import data from "../libraries.json";
import ErrorBoundary from "./error_page";

//Listing the libraries for navigation purposes
const LibrariesNav = () => {
  return (
    <div className="sideMenu">
      <ErrorBoundary>
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            modules
          </ListSubheader>
        }
      >
        {[]
          .concat(data.libraries)
          .sort((a, b) => a.lib_name.localeCompare(b.lib_name))
          .map((libraries, index) => {
            return (
              <Link
                to={`/${libraries.lib_name}`}
                key={`${index}_${libraries.lib_name}`}
              >
                <ListItem button>{libraries.lib_name}</ListItem>
              </Link>
            );
          })}
      </List>
      </ErrorBoundary>
    </div>
  );
};
export default LibrariesNav;
