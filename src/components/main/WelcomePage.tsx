// Copyright (C) 2020 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import {
  createStyles,
  StyleRules,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import React from "react";
import Summary from "../../containers/main/Summary";
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
          Toit standard libraries
        </Typography>
        <Typography className={this.props.classes.section}>
          Welcome to the standard libraries for the Toit programming language.
          The Toit SDK contains a vast amount of libraries, ready-to use classes
          and functionalities that allow a fast and easy use of Toit. This
          documentation contains the structure of the Toit libraries.
        </Typography>
        <Typography className={this.props.classes.section}>
          Except for the <b>core</b> library, you must import a library before
          you can use it. Here is an example of how to do it:
        </Typography>
        <CodeBlock
          code={
            "import metrics\n" +
            "import encoding.json as json\n" +
            "import peripherals show *\n" +
            "import fixed-point show FixedPoint"
          }
        />
        <Summary />
      </>
    );
  }
}

export default withStyles(styles)(WelcomePage);
