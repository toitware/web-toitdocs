import { ThemeProvider as EmotionThemeProvider } from "@emotion/react";
import {
  Theme,
  ThemeProvider as MaterialThemeProvider,
} from "@material-ui/core/styles";
import React from "react";

type ThemeProviderProps = React.PropsWithChildren<{
  theme: Theme;
}>;

/**
 * A simple helper component, that sets the theme for both, material-ui and
 * emotion.
 */
export function ThemeProvider({
  theme,
  children,
}: ThemeProviderProps): JSX.Element {
  return (
    <MaterialThemeProvider theme={theme}>
      <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>
    </MaterialThemeProvider>
  );
}

export default ThemeProvider;
