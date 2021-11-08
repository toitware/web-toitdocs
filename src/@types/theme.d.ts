export declare module "@material-ui/core/styles" {
  interface Theme {
    layout: {
      sidebarWidth: string | number;
      headerHeight: string | number;
      footerHeight: string | number;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    layout?: {
      sidebarWidth?: string | number;
      headerHeight?: string | number;
      footerHeight?: string | number;
    };
  }
}
