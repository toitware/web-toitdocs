// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, { ErrorInfo } from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  WithStyles,
  withStyles,
  createStyles,
  Theme,
  StyleRules,
} from "@material-ui/core";

const style = (theme: Theme): StyleRules =>
  createStyles({
    errorGrid: {
      padding: theme.spacing(1),
      margin: theme.spacing(1),
    },
  });

interface ErrorBoundaryProps extends WithStyles<typeof style> {
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
        <Grid item className={this.props.classes.errorGrid}>
          <h1>Something went wrong.</h1>
          <Link to={`/#`}>Home Page</Link>
        </Grid>
      );
    } else {
      return <>{this.props.children}</>;
    }
  }
}

export default withStyles(style)(ErrorBoundary);
