// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {
    width: "100%",
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
});

function List(objects, key_group) {
  return (
    <ul>
      {objects.map((element,i) => {
        return (<li key={"list_" + key_group + i}> {element.name} </li>);
      })}
    </ul>
  );
}

// Right sidebar that lists the content of module.
class ModuleContentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shown: {},
    };
  }

  render() {
    return (
      <div>

        <h4>Classes</h4>
        {List(this.props.value.classes, "classes")}

        <h4>Exported classes</h4>
        {List(this.props.value.export_classes, "export_classes")}

        <h4>Globals</h4>
        {List(this.props.value.globals, "globals")}

        <h4>Exported globals</h4>
        {List(this.props.value.export_globals, "export_globals")}

        <h4>Function</h4>
        {List(this.props.value.functions, "functions")}

        <h4>Exported functions</h4>
        {List(this.props.value.export_functions, "export_functions")}
      </div>
    );
  }
}

export default withStyles(styles)(ModuleContentList);
