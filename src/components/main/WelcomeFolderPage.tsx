// Copyright (C) 2020 Toitware ApS. All rights reserved.

import {
  createStyles,
  StyleRules,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import React from "react";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    header: {
      paddingBottom: theme.spacing(4),
    },
    section: {
      paddingBottom: theme.spacing(2),
    },
  });

type WelcomeFolderPageProps = WithStyles<typeof styles>;

class WelcomeFolderPage extends React.PureComponent<WelcomeFolderPageProps> {
  render(): JSX.Element {
    return (
      <>
        <Typography variant="h3" className={this.props.classes.header}>
          Toitdoc Viewer
        </Typography>
        <Typography className={this.props.classes.section}>
          Welcome to the Toitdoc viewer.
        </Typography>
        <Typography className={this.props.classes.section}>
          Select the library you want to view from the list on the left.
        </Typography>
      </>
    );
  }
}

export default withStyles(styles)(WelcomeFolderPage);
