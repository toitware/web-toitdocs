// Copyright (C) 2020 Toitware ApS. All rights reserved.

import { Grid, List, makeStyles } from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import { CodeBlock } from "./general/codeblock/CodeBlock";

const useStyles = makeStyles((theme) => ({
  textBox: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

const WelcomePage: React.FC = () => {
  const classes = useStyles();
  return (
    <Grid container>
      <Grid item xs={12} sm={9}>
        <Grid item container>
          <h1>ᴛᴏɪᴛ SDK Reference</h1>
        </Grid>
        <div className={classes.textBox}>
          <Grid container>
            Welcome to the ᴛᴏɪᴛ SDK reference. ᴛᴏɪᴛ SDK contains a vast amount
            of libraries and ready-to use classes and functionalities that allow
            a fast and easy use of Toitboxes. This documentation contains the
            structure of ᴛᴏɪᴛ libraries. These include:
          </Grid>
        </div>
        <Grid container justify="center">
          <List>
            <ListItemText>
              <h3>
                <b>Library names</b>
              </h3>
            </ListItemText>
            <ListItemText>
              <h3>
                <b>Module names</b>
              </h3>
            </ListItemText>
            <ListItemText>
              <h3>
                <b>Class names</b>
              </h3>
            </ListItemText>
            <ListItemText>
              <h3>
                <b>Class methods</b>
              </h3>
            </ListItemText>
          </List>
        </Grid>
        <div className={classes.textBox}>
          <Grid item container>
            <p>
              Except for&nbsp;<b>core</b>, you must import a library before you
              can use it. Here&apos;s an example of how to do it:
            </p>
          </Grid>
        </div>
        <CodeBlock
          code={[
            "import metrics",
            "import encoding.json as json",
            "import peripherals show *",
            "import pixel_display show TwoColorPixelDisplay",
          ]}
        ></CodeBlock>
        <div className={classes.textBox}>
          <Grid>
            As can be seen from the examples above there different ways of
            importing content to your program. You can import the whole library,
            its module or even a single class. It is also possible to add an
            alias to imported library.
          </Grid>
        </div>
      </Grid>
    </Grid>
  );
};

export default WelcomePage;
