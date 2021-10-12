// Copyright (C) 2020 Toitware ApS. All rights reserved.

import { AppBar, Grid, StyleRules, Theme } from "@material-ui/core";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo-simple.png";
import Search from "../../containers/header/Search";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    root: {
      height: theme.layout.headerHeight,
    },
  });

type HeaderBarProps = WithStyles<typeof styles>;

class HeaderBar extends Component<HeaderBarProps> {
  render(): JSX.Element {
    const classes = this.props.classes;
    return (
      <Grid container item xs={12} className={classes.root}>
        <Grid item xs={12}>
          <AppBar position="fixed" elevation={0}>
            <Toolbar>
              <Link to={"./"}>
                <img alt="Toit" src={logo} height="32px"></img>
              </Link>
              <Search />
            </Toolbar>
          </AppBar>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(HeaderBar);
