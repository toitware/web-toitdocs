// Copyright (C) 2020 Toitware ApS. All rights reserved.

import { Box, CircularProgress, Grid } from "@material-ui/core";
import {
  createStyles,
  StyleRules,
  Theme,
  ThemeProvider,
  withStyles,
  WithStyles,
} from "@material-ui/core/styles";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route, RouteComponentProps } from "react-router-dom";
import "./assets/global_theme.css";
import "./assets/index.css";
import { theme } from "./assets/theme";
import { ClassInfoParams } from "./components/ClassInfoView";
import { ClassNavParams } from "./components/ClassNavView";
import ErrorBoundary from "./components/ErrorPage";
import ScrollableContainer from "./components/general/ScrollableContainer";
import { HEADER_BAR_HEIGHT } from "./components/HeaderBarView";
import { LibrariesNavParams } from "./components/Library/LibrariesNavView";
import { LibraryInfoParams } from "./components/Library/LibraryInfoView";
import { ModuleInfoParams } from "./components/Module/ModuleInfoView";
import { ModuleNavParams } from "./components/Module/ModuleNavView";
import WelcomePage from "./components/WelcomePage";
import ClassInfo from "./containers/ClassInfo";
import ClassNav from "./containers/ClassNav";
import HeaderBar from "./containers/HeaderBar";
import LibrariesNav from "./containers/LibrariesNav";
import LibraryInfo from "./containers/LibraryInfo";
import ModuleInfo from "./containers/ModuleInfo";
import ModuleNav from "./containers/ModuleNav";
import { ToitObject } from "./model/toitsdk";
import { fetchSDK, RootState } from "./sdk";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    sideNav: {
      marginTop: theme.spacing(2),
    },
    outerGrid: {
      height: `calc(100vh - ${HEADER_BAR_HEIGHT}px)`,
    },
  });

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

interface AppProps extends WithStyles<typeof styles> {
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
              <Grid container className={this.props.classes.outerGrid}>
                <Grid item xs={12}>
                  <ScrollableContainer>
                    <Grid container className={this.props.classes.sideNav}>
                      <Grid
                        item
                        xs={12}
                        className={this.props.classes.topBuffer}
                      />
                      <Grid item xs={12} sm={2}>
                        <Route exact path="/" component={LibrariesNav} />
                        <Route
                          exact
                          path="/:libName"
                          render={(
                            routeProps: RouteComponentProps<LibrariesNavParams>
                          ): React.ReactNode => (
                            <LibrariesNav {...routeProps} />
                          )}
                        />
                        <Route
                          exact
                          path="/:libName/:moduleName"
                          render={(
                            routeProps: RouteComponentProps<ModuleNavParams>
                          ): React.ReactNode => <ModuleNav {...routeProps} />}
                        />
                        <Route
                          exact
                          path="/:libName/:moduleName/:className"
                          render={(
                            routeProps: RouteComponentProps<ClassNavParams>
                          ): React.ReactNode => <ClassNav {...routeProps} />}
                        />
                      </Grid>

                      <Grid item xs={12} sm={10}>
                        <ErrorBoundary>
                          <Route exact path="/" component={WelcomePage} />
                          <Route
                            exact
                            path="/:libName"
                            render={(
                              routeProps: RouteComponentProps<LibraryInfoParams>
                            ): React.ReactNode => (
                              <LibraryInfo {...routeProps} />
                            )}
                          />
                          <Route
                            exact
                            path="/:libName/:moduleName"
                            render={(
                              routeProps: RouteComponentProps<ModuleInfoParams>
                            ): React.ReactNode => (
                              <ModuleInfo {...routeProps} />
                            )}
                          />
                          <Route
                            exact
                            path="/:libName/:moduleName/:className"
                            render={(
                              routeProps: RouteComponentProps<ClassInfoParams>
                            ): React.ReactNode => <ClassInfo {...routeProps} />}
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
                  </ScrollableContainer>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(App));
