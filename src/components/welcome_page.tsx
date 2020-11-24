// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, { Component } from "react";
import ListItemText from "@material-ui/core/ListItemText";
import { Grid, List, Paper } from "@material-ui/core";

class WelcomePage extends Component {
  render() {
    return (
      <Grid container>
        <Grid item xs={12} sm={9}>
          <Grid item container justify="center">
            <h1>ᴛᴏɪᴛ SDK Reference</h1>
          </Grid>
          <div style={{ padding: 20 }}>
            <Grid container>
              Welcome to the ᴛᴏɪᴛ SDK reference. ᴛᴏɪᴛ SDK contains a vast amount
              of libraries and ready-to use classes and functionalities that
              allow a fast and easy use of Toitboxes. This documentation
              contains the structure of ᴛᴏɪᴛ libraries. These include:
            </Grid>
          </div>
          <Grid container justify="center">
            <List>
              <ListItemText>
                <h3><b>Library names</b></h3>
              </ListItemText>
              <ListItemText>
                <h3><b>Module names</b></h3>
              </ListItemText>
              <ListItemText>
                <h3><b>Class names</b></h3>
              </ListItemText>
              <ListItemText>
                <h3><b>Class methods</b></h3>
              </ListItemText>  
            </List>
          </Grid>
          <div style={{ padding: 20 }}>
            <Grid item container>
              <p>
                Except for&nbsp;<b>core</b>, you must import a library
                before you can use it. Here's an example of how to do it:
              </p>
            </Grid>
          </div>
          <div style={{ padding: 20 }}>
            <Grid item container justify="center">
              <Paper elevation={0} variant="outlined">
                <code>
                  <p>
                    <strong>import</strong> metrics
                  </p>
                  <p>
                    <strong>import</strong> encoding.json &nbsp;
                    <strong>as</strong> json
                  </p>
                  <p>
                    <strong>import</strong> peripherals &nbsp;
                    <strong>show</strong> *
                  </p>
                  <p>
                    <strong>import</strong> pixel_display &nbsp;
                    <strong>show</strong> TwoColorPixelDisplay
                  </p>
                </code>
              </Paper>
            </Grid>
          </div>
          <div style={{ padding: 20 }}>
            <Grid>
              As can be seen from the examples above there different ways of
              importing content to your program. You can import the whole
              library, its module or even a single class. It is also possible to
              add an alias to imported library.
            </Grid>
          </div>
        </Grid>
      </Grid>
    );
  }
}

export default WelcomePage;
