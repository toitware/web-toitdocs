// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
// import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { List } from "@material-ui/core";

const style = (theme) => ({
  root: {
    width: "100%",
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    paddingLeft: theme.spacing(4),
  },
});

function mapStateToProps(state, props) {
  const { sdk } = state;
  return {
    version: sdk.version,
    libraries: sdk.object.libraries,
    match: props.match,
  };
}

class ListLibraryModules extends Component {
  render() {
    return (
      <List>
        {this.props.library.lib_modules.map((element, i) => (
          <li key={"lib_module_name" + i}> {element.module} </li>
        ))}
      </List>
    );
  }
}

class LibraryInfo extends Component {
  render() {
    let propsOk = true;
    [
      this.props.libraries,
      this.props.match.params.libName,
      this.props.classes,
    ].forEach((elem) => {
      if (elem === undefined || elem === null) {
        propsOk = false;
      }
    });

    if (propsOk) {
      const {
        params: { libName },
      } = this.props.match;
      const classes = this.props.classes;
      const library = this.props.libraries.find(
        ({ lib_name }) => lib_name === libName
      );

      if ("lib_modules" in library && library.lib_modules !== undefined) {
        return (
          <Grid container>
            <Grid item xs={9}>
              <Box pt={2} pb={2}>
                <Typography component="h1" variant="h1">
                  Library: {library.lib_name}
                </Typography>
              </Box>
              <Box pt={2} pb={2}>
                <Box pt={1} pb={1}>
                  <Typography component="h2" variant="h2">
                    Modules
                  </Typography>
                </Box>
                <Paper variant="outlined" className={classes.paper}>
                  <ListLibraryModules library={library} />
                </Paper>
              </Box>
            </Grid>
          </Grid>
        );
      } else {
        return (
          <Grid containerclassName={classes.root}>
            <Grid item xs={9}>
              <Box pt={2} pb={2}>
                <Typography component="h1" variant="h1">
                  ERROR:
                  <p>Library: {libName} not found</p>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        );
      }
    } else {
      return (
        <Grid containerclassName={this.props.classes.root}>
          <Grid item xs={9}>
            <Box pt={2} pb={2}>
              <Typography component="h1" variant="h1">
                ERROR:
                <p>Library not found</p>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      );
    }
  }
}

export default withStyles(style, { withTheme: true })(
  connect(mapStateToProps)(LibraryInfo)
);
