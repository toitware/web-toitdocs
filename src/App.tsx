// Copyright (C) 2020 Toitware ApS. All rights reserved.

import { CircularProgress, Grid } from "@material-ui/core";
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
import ErrorBoundary from "./components/ErrorPage";
import ScrollableContainer from "./components/general/ScrollableContainer";
import ScrollToTop from "./components/general/ScrollToTop";
import HeaderBar, { HEADER_BAR_HEIGHT } from "./components/header/HeaderBar";
import { ClassInfoParams } from "./components/main/ClassInfoView";
import { ModuleInfoParams } from "./components/main/ModuleInfoView";
import WelcomePage from "./components/main/WelcomePage";
import { NavigationParams } from "./components/navigation/NavigationView";
import ClassInfo from "./containers/main/ClassInfo";
import ModuleInfo from "./containers/main/ModuleInfo";
import Navigation from "./containers/navigation/Navigation";
import { fetchSDK, RootState } from "./redux/sdk";

const mapStateToProps = (
  state: RootState
): Pick<AppProps, "ready" | "sdkVersion"> => {
  return {
    ready: state.sdk.modules !== undefined,
    sdkVersion: state.sdk.sdkVersion,
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

const styles = (theme: Theme): StyleRules =>
  createStyles({
    outer: {
      height: `calc(100vh - ${HEADER_BAR_HEIGHT}px)`,
    },
    mainContent: {
      padding: theme.spacing(2),
    },
    sdkVersion: {
      display: "flex",
      justifyContent: "center",
    },
  });

interface AppProps extends WithStyles<typeof styles> {
  sdkVersionFromParams: string;
  ready: boolean;
  sdkVersion: string | undefined;
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
          <ScrollToTop />
          {this.props.ready ? (
            <>
              <ErrorBoundary>
                <HeaderBar />
              </ErrorBoundary>
              <div className={this.props.classes.outer}>
                <ScrollableContainer>
                  <Grid
                    container
                    spacing={2}
                    className={this.props.classes.mainContent}
                  >
                    <Grid item xs={12} />
                    <Grid item sm={2}>
                      <Route
                        exact
                        path="/"
                        render={(
                          routeProps: RouteComponentProps<NavigationParams>
                        ): React.ReactNode => <Navigation {...routeProps} />}
                      />
                      <Route
                        exact
                        path="/:moduleName*/:rest"
                        render={(
                          routeProps: RouteComponentProps<NavigationParams>
                        ): React.ReactNode => <Navigation {...routeProps} />}
                      />
                    </Grid>

                    <Grid item xs={12} sm={10}>
                      <ErrorBoundary>
                        <Route exact path="/" component={WelcomePage} />
                        <Route
                          exact
                          path="/:moduleName+/module-summary"
                          render={(
                            routeProps: RouteComponentProps<ModuleInfoParams>
                          ): React.ReactNode => <ModuleInfo {...routeProps} />}
                        />
                        <Route
                          exact
                          path="/:moduleName+/class-:className"
                          render={(
                            routeProps: RouteComponentProps<ClassInfoParams>
                          ): React.ReactNode => <ClassInfo {...routeProps} />}
                        />
                      </ErrorBoundary>
                    </Grid>
                    <Grid item xs={12}>
                      <div className={this.props.classes.sdkVersion}>
                        SDK version: {this.props.sdkVersion}
                      </div>
                    </Grid>
                  </Grid>
                </ScrollableContainer>
              </div>
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
