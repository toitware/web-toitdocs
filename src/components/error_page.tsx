// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, { ErrorInfo } from "react";
import { Link } from "react-router-dom";
import { Grid } from "@material-ui/core";

interface ErrorBoundaryProps {
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
        <Grid item style={{ padding: "10px", margin: "10px" }}>
          <h1>Something went wrong.</h1>
          <Link to={`/#`}>Home Page</Link>
        </Grid>
      );
    } else {
      return <>{this.props.children}</>;
    }
  }
}

export default ErrorBoundary;
