// Copyright (C) 2020 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import { Theme, Typography } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import Summary from "../../containers/main/Summary";
import CodeBlock from "../general/CodeBlock";

const useStyles = makeStyles()((theme: Theme) => ({
  header: {
    paddingBottom: theme.spacing(4),
  },
  section: {
    paddingBottom: theme.spacing(2),
  },
  packages: {
    paddingBottom: theme.spacing(1),
  },
}));

export default function WelcomePage(): JSX.Element {
  const { classes } = useStyles();
  return (
    <>
      <Typography variant="h3" className={classes.header}>
        Toit standard libraries
      </Typography>
      <Typography className={classes.section}>
        Welcome to the standard libraries for the Toit programming language.
        The Toit SDK contains a vast amount of libraries, ready-to use classes
        and functionalities that allow a fast and easy use of Toit. This
        documentation contains the structure of the Toit libraries.
      </Typography>
      <Typography className={classes.section}>
        Except for the <b>core</b> library, you must import a library before
        you can use it. Here is an example of how to do it:
      </Typography>
      <CodeBlock
        code={
          "import io\n" +
          "import encoding.json\n" +
          "import net.tcp as net\n" +
          "import uuid show *\n" +
          "import fixed-point show FixedPoint"
        }
      />
      <Summary />
      <div>
        <Typography variant="h4" className={classes.packages}>
          Packages
        </Typography>
        <Typography className={classes.section}>
          Additional libraries are distributed as packages. You can find them
          at <a href="https://pkg.toit.io/">pkg.toit.io</a>.
        </Typography>
      </div>
    </>
  );
}
