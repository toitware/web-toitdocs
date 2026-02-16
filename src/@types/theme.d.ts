// Copyright (C) 2024 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

export declare module "@mui/material/styles" {
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
