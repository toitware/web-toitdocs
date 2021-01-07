import { ListItem, ListItemText, makeStyles } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  item: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

export default function ListItemLink(props: {
  primary: string;
  to: string;
}): JSX.Element {
  const classes = useStyles();
  return (
    <ListItem button component={Link} to={props.to} className={classes.item}>
      <ListItemText primary={props.primary} />
    </ListItem>
  );
}
