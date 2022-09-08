// Copyright (C) 2020 Toitware ApS. All rights reserved.

import styled from "@emotion/styled";
import { CircularProgress } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import CookieConsent from "@toitware/cookie-consent";
import React, { Component, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import {
  BrowserRouter,
  Redirect,
  Route,
  RouteComponentProps,
  useLocation,
} from "react-router-dom";
import { length, sideBarTheme, theme } from "./assets/theme";
import "./assets/typography.css";
import ErrorBoundary from "./components/ErrorPage";
import HeaderBar from "./components/header/HeaderBar";
import { ClassInfoParams } from "./components/main/ClassInfoView";
import { LibraryInfoParams } from "./components/main/LibraryInfoView";
import WelcomePage from "./components/main/WelcomePage";
import NavigationView, {
  NavigationParams,
} from "./components/navigation/NavigationView";
import ThemeProvider from "./components/ThemeProvider";
import ClassInfo from "./containers/main/ClassInfo";
import LibraryInfo from "./containers/main/LibraryInfo";
import { Libraries } from "./model/model";
import { fetchDoc, RootState } from "./redux/doc";

const mapStateToProps = (
  state: RootState
): Pick<AppProps, "libraries" | "version" | "sdkVersion"> => {
  return {
    version: state.doc.version,
    sdkVersion: state.doc.sdkVersion,
    libraries: state.doc.libraries,
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    "@global": {
      body: {
        margin: 0,
        fontFamily: "Roboto",
      },

      code: {
        fontFamily: "monospace",
        fontSize: 14,
      },

      "*": {
        boxSizing: "border-box",
      },
      "a:link": {
        color: theme.palette.primary.main,
        textDecoration: "none",
      },
      "a:visited": {
        color: theme.palette.primary.main,
        textDecoration: "none",
      },
      "a:hover": {
        textDecoration: "underline",
      },
    },
    appContainer: {
      position: "relative",
    },
  })
);

const ContentWrapper = styled.div`
  padding-top: calc(3rem + ${({ theme }) => length(theme.layout.headerHeight)});
  margin-left: ${({ theme }) => length(theme.layout.sidebarWidth)};
`;

const Content = styled.div`
  padding-left: 3rem;
  padding-right: 3rem;
  min-height: calc(100vh - ${({ theme }) => length(theme.layout.footerHeight)});
  /* max-width: 44rem; The width I'd actually like to use once the sidebar is implemented */
  max-width: 55rem;
  margin: 0 auto;

  *[id] {
    /* Make sure that anchor links aren't hidden behind the header */
    scroll-margin-top: ${({ theme }) => length(theme.layout.headerHeight)};
  }
`;

const Footer = styled.footer`
  text-align: center;
  padding: 0 3rem;
  height: ${({ theme }) => length(theme.layout.headerHeight)};
  margin-left: ${({ theme }) => length(theme.layout.sidebarWidth)};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledCircularProgress = styled(CircularProgress)`
  position: absolute;
  width: 40px;
  height: 40px;
  top: calc(50% - 20px);
  left: calc(50% - 20px);
`;

interface AppProps {
  versionFromParams: string;
  libraries?: Libraries;
  sdkVersion?: string;
  version?: string;
  fetchDoc: (version: string) => void;
}

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

export enum ViewMode {
  Package = "package",
  SDK = "sdk",
}

export const viewMode = getMetaValue("toitdoc-mode", "sdk") as ViewMode;
export const packageName = getMetaValue("toitdoc-package-name");

class App extends Component<AppProps> {
  componentDidMount(): void {
    this.props.fetchDoc(this.props.versionFromParams);
  }

  render(): JSX.Element {
    return (
      <>
        <ThemeProvider theme={theme}>
          <BrowserRouter basename={baseURL}>
            <AppContent {...this.props} />
          </BrowserRouter>
        </ThemeProvider>
      </>
    );
  }
}

const FixedNavigationView = styled(NavigationView)`
  position: fixed;
  width: ${(props): string => length(props.theme.layout.sidebarWidth)};
  height: 100vh;
  top: 0;
  left: 0;
`;

function AppContent(props: AppProps): JSX.Element {
  const classes = useStyles(props);
  const segmentAPIKey = useMemo(() => getMetaValue("segment-key"), []);

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const packageURL =
    props.libraries !== undefined ? `/${packageName}/library-summary` : "";

  return (
    <>
      {props.libraries !== undefined ? (
        <>
          <div className={classes.appContainer}>
            <ErrorBoundary>
              <HeaderBar />
            </ErrorBoundary>
            <ThemeProvider theme={sideBarTheme}>
              <Route
                exact
                path="/"
                render={(
                  routeProps: RouteComponentProps<NavigationParams>
                ): React.ReactNode => <FixedNavigationView {...routeProps} />}
              />
              <Route
                exact
                path="/:libraryName*/:rest"
                render={(
                  routeProps: RouteComponentProps<NavigationParams>
                ): React.ReactNode => <FixedNavigationView {...routeProps} />}
              />
            </ThemeProvider>

            <ContentWrapper>
              <Content>
                <ErrorBoundary>
                  {viewMode === ViewMode.Package ? (
                    <Route exact path="/">
                      <Redirect to={packageURL} />
                    </Route>
                  ) : (
                    <Route exact path="/" component={WelcomePage} />
                  )}
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
              </Content>
            </ContentWrapper>
            <Footer>SDK version: {props.sdkVersion}</Footer>
          </div>
        </>
      ) : (
        <StyledCircularProgress disableShrink />
      )}
      <CookieConsent
        segmentKey={segmentAPIKey}
        changeConsent={false}
        show={true}
      />
    </>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
