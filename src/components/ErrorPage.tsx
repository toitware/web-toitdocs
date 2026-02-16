// Copyright (C) 2020 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import { Grid, Theme } from "@mui/material";
import React, { ErrorInfo } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()((theme: Theme) => ({
  grid: {
    margin: theme.spacing(3),
  },
}));

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Error boundaries must be class components
class ErrorBoundaryInner extends React.Component<
  ErrorBoundaryProps & { classes: Record<string, string> },
  ErrorBoundaryState
> {
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
        <Grid className={this.props.classes.grid}>
          <h1>Something went wrong.</h1>
          <Link to={`/#`}>Home Page</Link>
        </Grid>
      );
    } else {
      return <>{this.props.children}</>;
    }
  }
}

// Wrapper to inject makeStyles into the class component
export default function ErrorBoundary(props: ErrorBoundaryProps): JSX.Element {
  const { classes } = useStyles();
  return <ErrorBoundaryInner classes={classes} {...props} />;
}
