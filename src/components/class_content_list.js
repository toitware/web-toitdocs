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

function PrintListStat(object, elem1, elem2) {
  let class_struct;
  try {
    class_struct = object.value.class_structure;
  } catch (error) {
    return null;
  }
  if (![undefined, null].includes(class_struct[elem1])) {
    try {
      return []
        .concat(object.value.class_structure[elem1])
        .map((element, i) => {
          return <li key={"print_list_stat_" + i}> {element[elem2]} </li>;
        });
    } catch (err) {
      console.log("ERROR: Crashed while running PrintListStat");
      return null;
    }
  }
}

function PrintListMembers(object, elem1, elem2) {
  let class_members;
  try {
    class_members = object.value.class_structure.members;
  } catch (error) {
    return null;
  }
  if (![undefined, null].includes(class_members[elem1])) {
    try {
      return [].concat(class_members[elem1]).map((element, i) => {
        return <li key={"print_list_mem_" + i}> {element[elem2]} </li>;
      });
    } catch (err) {
      console.log("ERROR: Crashed while running PrintListMembers");
      return null;
    }
  } 
  else {
    return null;
  }
}

class ClassContentList extends React.Component {
  render() {
    return (
      <div>
        <h4>Constructors</h4>
        <ul>{PrintListStat(this.props, "constructors", "function_name")}</ul>

        <h4>Statics</h4>
        <ul>{PrintListStat(this.props, "statics", "function_name")}</ul>

        <h4>Member Fields</h4>
        <ul>{PrintListMembers(this.props, "fields", "field_name")}</ul>

        <h4>Member Methods</h4>
        <ul>{PrintListMembers(this.props, "methods", "function_name")}</ul>
      </div>
    );
  }
}

export default withStyles(styles)(ClassContentList);
