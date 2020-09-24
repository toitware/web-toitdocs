// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React from "react";
import ListSubheader from "@material-ui/core/ListSubheader";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import data from "../libraries.json";
import ErrorBoundary from "./error_page";

//Listing modules for navigation purposes
const ModuleNav = ({ match }) => {
  const {
    params: { libName },
  } = match;
  let library = data.libraries.find(({ lib_name }) => lib_name === libName);
  return (
    <div className="sideMenu">
      <ErrorBoundary>
      <List
        component="nav"
        disablePadding
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            <Link to={`/`}>modules</Link>
            {" / "}
            {libName}
          </ListSubheader>
        }
      >
        {[]
          .concat(library.lib_modules)
          .sort((a, b) => a.module.localeCompare(b.module))
          .map((lib_modules, index) => {
            return (
              <Link
                to={`/${libName}/${lib_modules.module}`}
                key={lib_modules.module}
              >
                <ListItem button>{lib_modules.module}</ListItem>
              </Link>
            );
          })}
      </List>
    </ErrorBoundary>
    </div>
  );
};

export default ModuleNav;
