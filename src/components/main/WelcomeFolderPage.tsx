// Copyright (C) 2020 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import { Theme, Typography } from "@mui/material";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme: Theme) => ({
  header: {
    paddingBottom: theme.spacing(4),
  },
  section: {
    paddingBottom: theme.spacing(2),
  },
}));

export default function WelcomeFolderPage(): JSX.Element {
  const { classes } = useStyles();
  return (
    <>
      <Typography variant="h3" className={classes.header}>
        Toitdoc Viewer
      </Typography>
      <Typography className={classes.section}>
        Welcome to the Toitdoc viewer.
      </Typography>
      <Typography className={classes.section}>
        Select the library you want to view from the list on the left.
      </Typography>
    </>
  );
}
