import { Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => ({
  page: {
    width: "100%",
  },
  strong: {
    fontWeight: 600,
    fontFamily: "monospace",
    display: "inline",
  },
  normal: {
    display: "inline",
    fontFamily: "monospace",
  },
  containerMargin: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  paperCode: {
    width: "100%",
  },
}));

interface CodeBlockProps {
  code: string[] | string;
}

function FormattedCode(props: { codeInput: string[] | string }): JSX.Element {
  const classes = useStyles();

  let code = [] as string[];
  if (typeof props.codeInput === "string") {
    code = [props.codeInput];
  } else {
    code = props.codeInput;
  }

  // Split on newlines
  code = code
    .map((line) => {
      return line.split(/\r?\n/);
    })
    .flat();

  //Iterates over the different lines of code and formats it.
  return (
    <div>
      {code.map((value, i) => {
        const piecesOfLine = value.split(" ");
        return (
          <div key={i}>
            {piecesOfLine.map((word, j) => {
              if (word === "import" || word === "show" || word === "as")
                return (
                  <Typography className={classes.strong} key={j}>
                    {word}{" "}
                  </Typography>
                );
              else {
                return (
                  <Typography className={classes.normal} key={j}>
                    {word}{" "}
                  </Typography>
                );
              }
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function CodeBlock(props: CodeBlockProps): JSX.Element {
  const classes = useStyles();
  return (
    <Paper className="paperCode" elevation={0} variant="outlined">
      <Grid
        container
        item
        xs={12}
        direction="row"
        className={classes.containerMargin}
      >
        <FormattedCode codeInput={props.code} />
      </Grid>
    </Paper>
  );
}
