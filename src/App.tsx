// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, { Component } from "react";
import { connect } from "react-redux";
import "./App.css";
import LibrariesNav from "./components/libraries_nav";
import ModuleInfo from "./components/module_info";
import { Grid, CircularProgress, Box } from "@material-ui/core";
import { HashRouter, Route } from "react-router-dom";
import ModuleNav from "./components/module_nav";
import ClassInfo from "./components/ClassInfoView";
import ClassNav from "./components/class_nav";
import LibraryInfo from "./components/library_info";
import WelcomePage from "./components/welcome_page";
import { ThemeProvider } from "@material-ui/core/styles";
import "./assets/global_theme.css";
import ErrorBoundary from "./components/error_page";
import "./assets/index.css";
import { theme } from "./assets/theme";
import { ToitObject } from "./model/toitsdk";
import { fetchSDK, RootState } from "./sdk";
import HeaderBar from "./containers/HeaderBar";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";

const mapStateToProps = (state: RootState): Pick<AppProps, "object"> => {
  return {
    object: state.sdk.object,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, void, AnyAction>
): Pick<AppProps, "fetchSdk"> => {
  return {
    fetchSdk: (version: string): void => {
      void dispatch(fetchSDK(version));
    },
  };
};

interface AppProps {
  sdkVersionFromParams: string;
  object?: ToitObject;
  fetchSdk: (version: string) => void;
}

class App extends Component<AppProps> {
  componentDidMount(): void {
    this.props.fetchSdk(this.props.sdkVersionFromParams);
  }

  render(): JSX.Element {
    return (
      <ThemeProvider theme={theme}>
        <HashRouter>
          {this.props.object !== undefined ? (
            <>
              <ErrorBoundary>
                <HeaderBar />
              </ErrorBoundary>
              <Grid container spacing={3} style={{ padding: 0, marginTop: 45 }}>
                <Grid item xs={12} sm={2}>
                  <Route exact path="/" component={LibrariesNav} />
                  <Route exact path="/:libName" component={LibrariesNav} />
                  <Route
                    exact
                    path="/:libName/:moduleName"
                    component={ModuleNav}
                  />
                  <Route
                    exact
                    path="/:libName/:moduleName/:className"
                    component={ClassNav}
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
                  </ErrorBoundary>
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="center">
                    SDK version: {this.props.object.sdk_version}
                  </Box>
                </Grid>
              </Grid>
            </>
          ) : (
            <CircularProgress disableShrink />
          )}
        </HashRouter>
      </ThemeProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
