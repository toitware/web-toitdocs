// Copyright (C) 2020 Toitware ApS. All rights reserved.

import {
  createStyles,
  StyleRules,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import React from "react";
import CodeBlock from "../general/CodeBlock";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    header: {
      paddingBottom: theme.spacing(4),
    },
    section: {
      paddingBottom: theme.spacing(2),
    },
  });

type WelcomePageProps = WithStyles<typeof styles>;

class WelcomePage extends React.PureComponent<WelcomePageProps> {
  render(): JSX.Element {
    return (
      <>
        <Typography variant="h3" className={this.props.classes.header}>
          ᴛᴏɪᴛ SDK Reference
        </Typography>
        <Typography className={this.props.classes.section}>
          Welcome to the ᴛᴏɪᴛ SDK reference. ᴛᴏɪᴛ SDK contains a vast amount of
          modules, ready-to use classes and functionalities that allow a fast
          and easy use of Toit. This documentation contains the structure of
          ᴛᴏɪᴛ modules.
        </Typography>
        <Typography className={this.props.classes.section}>
          Except for the <b>core</b> module, you must import a module before you
          can use it. Here is an example of how to do it:
        </Typography>
        <CodeBlock
          code={
            "import metrics\n" +
            "import encoding.json as json\n" +
            "import peripherals show *\n" +
            "import pixel_display show TwoColorPixelDisplay"
          }
        />
      </>
    );
  }
}

export default withStyles(styles)(WelcomePage);
