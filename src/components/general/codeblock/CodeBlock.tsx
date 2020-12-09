import React from "react";
import { makeStyles, Grid, Paper, Typography } from "@material-ui/core";

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

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
}: CodeBlockProps) => {
  const classes = useStyles();
  const formatCode = (arr: string[] | string): JSX.Element => {
    //Iterates over the different lines of code and formats it.
    return (
      <div>
        {Array.isArray(code) &&
          code.map((value, i) => {
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
        {typeof code === "string" &&
          code.split(" ").map((word, i) => {
            if (word === "import" || word === "show" || word === "as")
              return (
                <Typography className={classes.strong} key={i}>
                  {word}{" "}
                </Typography>
              );
            else {
              return (
                <Typography className={classes.normal} key={i}>
                  {word}{" "}
                </Typography>
              );
            }
          })}
      </div>
    );
  };
  return (
    <Paper className="paperCode" elevation={0} variant="outlined">
      <Grid
        container
        item
        xs={12}
        direction="row"
        className={classes.containerMargin}
      >
        {formatCode(code)}
      </Grid>
    </Paper>
  );
};
