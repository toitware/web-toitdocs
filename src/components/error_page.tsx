// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React from "react";
import { Link } from "react-router-dom";
import { Grid } from "@material-ui/core";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
  }

  render() {
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
      return this.props.children;
    }
  }
}

export default ErrorBoundary;
