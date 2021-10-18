// Copyright (C) 2020 Toitware ApS. All rights reserved.

import styled from "@emotion/styled";
import { AppBar } from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import React from "react";
import { length } from "../../assets/theme";
import Search from "../../containers/header/Search";

const StyledAppBar = styled(AppBar)`
  height: ${({ theme }) => theme.layout.headerHeight};
  left: ${({ theme }) => theme.layout.sidebarWidth};
  width: calc(100% - ${({ theme }) => length(theme.layout.sidebarWidth)});
  border-bottom: 1px solid black;
  background: rgba(255, 255, 255, 0.6);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
`;

export function HeaderBar(): JSX.Element {
  return (
    <StyledAppBar color="default" position="fixed" elevation={0}>
      <Toolbar>
        <Search />
      </Toolbar>
    </StyledAppBar>
  );
}

export default HeaderBar;
