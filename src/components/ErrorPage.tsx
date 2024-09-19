// Copyright (C) 2020 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import {
  createStyles,
  Grid,
  StyleRules,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import React, { ErrorInfo } from "react";
import { Link } from "react-router-dom";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    grid: {
      margin: theme.spacing(3),
    },
  });

interface ErrorBoundaryProps extends WithStyles<typeof styles> {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = {
    hasError: false,
  };

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Display fallback UI
    this.setState({ hasError: true });
  }

  render(): JSX.Element {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      console.log("ERROR: In the object ");
      return (
        <Grid item className={this.props.classes.grid}>
          <h1>Something went wrong.</h1>
          <Link to={`/#`}>Home Page</Link>
        </Grid>
      );
    } else {
      return <>{this.props.children}</>;
    }
  }
}

export default withStyles(styles)(ErrorBoundary);
