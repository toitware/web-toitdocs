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

function PrintList(objects, key_group) {
  return []
    .concat(objects)
    .map((obj, i) => {
      return <li key={"print_list_stat_" + key_group + + i}> {obj.name} </li>;
    });
}


class ClassContentList extends React.Component {
  render() {
    return (
      <div>
        <h4>Constructors</h4>
        <ul>{PrintList(this.props.value.structure.constructors, "constructors")}</ul>

        <h4>Statics</h4>
        <ul>{PrintList(this.props.value.structure.statics, "statics")}</ul>

        <h4>Fields</h4>
        <ul>{PrintList(this.props.value.structure.fields, "fields")}</ul>

        <h4>Methods</h4>
        <ul>{PrintList(this.props.value.structure.methods, "methods")}</ul>
      </div>
    );
  }
}

export default withStyles(styles)(ClassContentList);
