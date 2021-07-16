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
import CookieConsent from "@toitware/cookie-consent";
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
import { LibraryInfoParams } from "./components/main/LibraryInfoView";
import WelcomePage from "./components/main/WelcomePage";
import { NavigationParams } from "./components/navigation/NavigationView";
import ClassInfo from "./containers/main/ClassInfo";
import LibraryInfo from "./containers/main/LibraryInfo";
import Navigation from "./containers/navigation/Navigation";
import { fetchDoc, RootState } from "./redux/doc";

const mapStateToProps = (
  state: RootState
): Pick<AppProps, "ready" | "version" | "sdkVersion"> => {
  return {
    ready: state.doc.libraries !== undefined,
    version: state.doc.version,
    sdkVersion: state.doc.sdkVersion,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, void, AnyAction>
): Pick<AppProps, "fetchDoc"> => {
  return {
    fetchDoc: (version: string): void => {
      void dispatch(fetchDoc(version));
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
  versionFromParams: string;
  ready: boolean;
  sdkVersion?: string;
  version?: string;
  fetchDoc: (version: string) => void;
}

const setupCrispChat = (): void => {
  window.$crisp = [];
  window.CRISP_WEBSITE_ID = "d7358065-35d6-43ee-bcd9-608d223d7aab";
  const s = document.createElement("script");
  s.src = "https://client.crisp.chat/l.js";
  s.async = true;
  document.getElementsByTagName("head")[0].appendChild(s);
};

export function getMetaValue(key: string, def = ""): string {
  if (typeof document === "undefined") {
    return def;
  }

  // Check if the meta `key` is set.
  const obj = document.querySelector('meta[name="' + key + '"]');
  if (obj) {
    return obj.getAttribute("content") || def;
  }
  return def;
}

function getBaseURL(): string {
  const def = process.env.PUBLIC_URL;
  const obj = document.querySelector("base[href]");
  return obj?.getAttribute("href") || def;
}
export const baseURL = getBaseURL();

class App extends Component<AppProps> {
  componentDidMount(): void {
    this.props.fetchDoc(this.props.versionFromParams);
    setupCrispChat();
  }

  render(): JSX.Element {
    const segmentAPIKey = getMetaValue("segment-key");

    return (
      <ThemeProvider theme={theme}>
        <BrowserRouter basename={baseURL}>
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
                        path="/:libraryName*/:rest"
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
                          path="/:libraryName+/library-summary"
                          render={(
                            routeProps: RouteComponentProps<LibraryInfoParams>
                          ): React.ReactNode => <LibraryInfo {...routeProps} />}
                        />
                        <Route
                          exact
                          path="/:libraryName+/class-:className"
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
        <CookieConsent
          segmentKey={segmentAPIKey}
          changeConsent={false}
          show={true}
        />
      </ThemeProvider>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(App));
