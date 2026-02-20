// Copyright (C) 2024 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import { ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()(() => ({
  item: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

export default function ListItemLink(props: {
  primary: string;
  to: string;
}): JSX.Element {
  const { classes } = useStyles();
  return (
    <ListItem component={Link} to={props.to} className={classes.item}>
      <ListItemText primary={props.primary} />
    </ListItem>
  );
}
