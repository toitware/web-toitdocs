// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, {Component}  from "react";
import {connect} from "react-redux"
import ListSubheader from "@material-ui/core/ListSubheader";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ErrorBoundary from "./error_page";

function mapStateToProps(state, props) {
  const { sdk } = state
  return { version: sdk.version, libraries: sdk.object.libraries, match: props.match }
}

//Listing modules for navigation purposes
class ModuleNav extends Component {
  render() {
    let already_listed = [];
    const {
      params: { libName },
    } = this.props.match;
    let library = this.props.libraries.find(({ name }) => name === libName);

    return (
      <div className="sideMenu">
        <ErrorBoundary>
        {library && library.modules &&
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
            {
              [].concat(library.modules)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((module, index) => {
                  // TODO: already_listed should not be nessesary
                  if (!already_listed.includes(module.name)){
                    already_listed.push(module.module);
                    return (
                      <Link
                        to={`/${libName}/${module.name}`}
                        key={module.name+"-"+index}
                      >
                        <ListItem button>{module.name}</ListItem>
                      </Link>
                    );
                  } else {
                    return null;
                  }
              })
            }
          </List>
        }
      </ErrorBoundary>
      </div>
    );
  }
};

export default connect(mapStateToProps)(ModuleNav);
