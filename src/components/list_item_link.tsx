import React from "react";
import { ListItem, ListItemText } from "@material-ui/core";
import { Link } from "react-router-dom";

export default function ListItemLink(props: {
  primary: string;
  to: string;
}): JSX.Element {
  return (
    <li>
      <ListItem button component={Link} to={props.to}>
        <ListItemText primary={props.primary} />
      </ListItem>
    </li>
  );
}
