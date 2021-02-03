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
  code: string;
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
        <div>
          {props.code.split(/\r?\n/).map((value, i) => {
            const piecesOfLine = value.split(" ");
            return (
              <div key={i}>
                {piecesOfLine.map((word, j) => {
                  const isStrong =
                    word === "import" || word === "show" || word === "as";
                  return (
                    <Typography
                      className={isStrong ? classes.strong : classes.normal}
                      key={j}
                    >
                      {word}{" "}
                    </Typography>
                  );
                })}
              </div>
            );
          })}
        </div>
      </Grid>
    </Paper>
  );
}
