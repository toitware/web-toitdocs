// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import data from "../libraries.json";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { List } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    paddingLeft: theme.spacing(4),
  },
}));

function LibraryModules(match) {
  var output;
  try {
    output = data.libraries
      .find((element) => element.lib_name === match.value.params.libName)
      .lib_modules.map((element, i) => {
        return <li key={"lib_module_name" + i}> {element.module} </li>;
      });
  } catch (err) {
    output = "Error";
  }
  return output;
}

// Description of the library
const LibraryInfo = ({ match }) => {
  const classes = useStyles();
  let propsOk = true;
  [data.libraries, match.params.libName].forEach((elem) => {
    if (elem === undefined || elem === null) {
      propsOk = false;
    }
  });
  if (propsOk) {
    const {
      params: { libName },
    } = match;

    const library = data.libraries.find(({ lib_name }) => lib_name === libName);

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
                <List>
                  <LibraryModules value={match} />
                </List>
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
      <Grid containerclassName={classes.root}>
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
};

export default LibraryInfo;
