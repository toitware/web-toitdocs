// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React from "react";
import ListSubheader from "@material-ui/core/ListSubheader";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import data from "../libraries.json";
import ErrorBoundary from "./error_page";

function ContentsOfNavbar(props) {
  let propsOk = true;
  [
    props.modules.module_classes,
    props.libName,
    props.moduleName,
    props.modules.module,
    props.modules.top_level
  ].forEach(elem => {
    if (elem === undefined || elem === null) {
      propsOk = false;
    }
  }
  );
  
  if (propsOk) {
    return (
      <div>
        {props.modules.module_classes
          .sort((a, b) => a.class_name.localeCompare(b.class_name))
          .map((classinfo, index) => {
            return (
              <Link
                to={`/${props.libName}/${props.moduleName}/${classinfo.class_name}`}
                key={classinfo.class_name}
              >
                <ListItem button>{classinfo.class_name}</ListItem>
              </Link>
            );
          })}
      </div>
    );
  } else {
    return <div></div>;
  }
}

const ClassNav = ({ match }) => {
  const {
    params: { libName, moduleName, className },
  } = match;

  const modules = data.libraries
    .find(({ lib_name }) => lib_name === libName)
    .lib_modules.find(({ module }) => module === moduleName);


  if (modules !== undefined) {
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
                <Link to={`/${libName}`}>{libName}</Link>
                {" / "}
                <Link to={`/${libName}/${moduleName}`}>{moduleName}</Link>
              </ListSubheader>
            }
          >
            {" "}
            <ContentsOfNavbar
              modules={modules}
              libName={libName}
              moduleName={moduleName}
            />
          </List>
        </ErrorBoundary>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export { ClassNav, data };
