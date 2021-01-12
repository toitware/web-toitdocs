// Copyright (C) 2020 Toitware ApS. All rights reserved.

import {
  StyleRules,
  Theme,
  WithStyles,
  withStyles,
} from "@material-ui/core/styles";
import React from "react";
import { ToitModule } from "../generator/sdk";

const styles = (theme: Theme): StyleRules => ({
  root: {
    width: "100%",
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
});

function List(objects: { name: string }[], keyGroup: string): JSX.Element {
  return (
    <ul>
      {objects.map((element, i) => {
        return <li key={"list_" + keyGroup + i}> {element.name} </li>;
      })}
    </ul>
  );
}

interface ModuleContentListProps extends WithStyles<typeof styles> {
  module: ToitModule;
}

// Right sidebar that lists the content of module.
class ModuleContentList extends React.Component<ModuleContentListProps> {
  render(): JSX.Element {
    return (
      <div>
        {this.props.module.classes.length > 0 && (
          <div>
            <h4>Classes</h4>
            {List(this.props.module.classes, "classes")}
          </div>
        )}

        {this.props.module.export_classes.length > 0 && (
          <div>
            <h4>Exported classes</h4>
            {List(this.props.module.export_classes, "export_classes")}
          </div>
        )}

        {this.props.module.globals.length > 0 && (
          <div>
            <h4>Globals</h4>
            {List(this.props.module.globals, "globals")}
          </div>
        )}

        {this.props.module.export_globals.length > 0 && (
          <div>
            <h4>Exported globals</h4>
            {List(this.props.module.export_globals, "export_globals")}
          </div>
        )}

        {this.props.module.functions.length > 0 && (
          <div>
            <h4>Functions</h4>
            {List(this.props.module.functions, "functions")}
          </div>
        )}

        {this.props.module.export_functions.length > 0 && (
          <div>
            <h4>Exported functions</h4>
            {List(this.props.module.export_functions, "export_functions")}
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(ModuleContentList);
