// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, {Component} from "react";
import {connect} from "react-redux"
import "./App.css";
import LibrariesNav from "./components/libraries_nav";
import ModuleInfo from "./components/module_info";
import { Grid } from "@material-ui/core";
import { HashRouter, Route } from "react-router-dom";
import ModuleNav from "./components/module_nav";
import ClassInfo from "./components/class_info";
import { ClassNav } from "./components/class_nav";
import { FunctionNav } from "./components/function_nav";
import LibraryInfo from "./components/library_info";
import WelcomePage from "./components/welcome_page";
import { ThemeProvider } from "@material-ui/core/styles";
import "./assets/global_theme.css";
import FunctionInfo from "./components/function_info";
import ErrorBoundary from "./components/error_page";
import HeaderBar from "./components/header_bar";
import "./assets/index.css";
import data from "./libraries.json";
import {theme} from "./assets/theme.ts";

function mapStateToProps(state) {
  const { sdk } = state
  return { version: sdk.version, object: sdk.object }
}

class App extends Component {

  componentDidMount() {
    console.log("state", this.props);
  }

  componentDidUpdate() {
    console.log("state", this.props);
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <HashRouter>
          <ErrorBoundary>
            <HeaderBar />
          </ErrorBoundary>
          <Grid
            container
            item
            spacing={3}
            style={{ padding: 0, marginTop: 45 }}
          >
            <Grid item xs={12} sm={2}>
              <Route exact path="/" component={LibrariesNav} />
              <Route exact path="/:libName" component={ModuleNav} />
              <Route exact path="/:libName/:moduleName" component={ModuleNav} />
              <Route
                exact
                path="/:libName/:moduleName/:className"
                component={ClassNav}
              />
              <Route
                exact
                path="/:libName/:moduleName/:className/:functionType/:functionName/:index"
                component={FunctionNav}
              />
            </Grid>

            <Grid item xs={12} sm={10}>
              <ErrorBoundary>
                <Route exact path="/" component={WelcomePage} />
                <Route exact path="/:libName" component={LibraryInfo} />
                <Route
                  exact
                  path="/:libName/:moduleName"
                  component={ModuleInfo}
                />
                <Route
                  exact
                  path="/:libName/:moduleName/:className"
                  component={ClassInfo}
                />
                <Route
                  exact
                  path="/:libName/:moduleName/:className/:functionType/:functionName/:index"
                  component={FunctionInfo}
                />
              </ErrorBoundary>
            </Grid>
            <Grid item xs={12} align="center">
              SDK version: {this.props.version}
            </Grid>
          </Grid>
        </HashRouter>
      </ThemeProvider>);
  }
}

export default connect(mapStateToProps)(App);
