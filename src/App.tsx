// Copyright (C) 2020 Toitware ApS. All rights reserved.

import { Box, CircularProgress, Grid } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";
import "./App.css";
import "./assets/global_theme.css";
import "./assets/index.css";
import { theme } from "./assets/theme";
import ClassNav from "./components/class_nav";
import ErrorBoundary from "./components/error_page";
import LibrariesNav from "./components/libraries_nav";
import LibraryInfo from "./components/library_info";
import ModuleInfo from "./components/ModuleInfoView";
import ModuleNav from "./components/module_nav";
import WelcomePage from "./components/welcome_page";
import ClassInfo from "./containers/ClassInfo";
import HeaderBar from "./containers/HeaderBar";
import { ToitObject } from "./model/toitsdk";
import { fetchSDK, RootState } from "./sdk";

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
        <BrowserRouter>
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
        </BrowserRouter>
      </ThemeProvider>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
