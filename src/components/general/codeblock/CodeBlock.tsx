import React from "react";
import { makeStyles, Grid, Paper, Typography } from "@material-ui/core";

const useStyles = makeStyles({
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
    paddingRight: "10%",
    paddingLeft: "10%",
    paddingTop: "24px",
    paddingBottom: "24px",
  },
  paperCode: {
    width: "100%",
  },
});

interface Props {
  code: string[];
}

export const CodeBlock: React.FC<Props> = ({ code }: Props) => {
  const classes = useStyles();
  const formatCode = (arr: string[]): JSX.Element => {
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
  };
  return (
    <Paper className="paperCode" elevation={0} variant="outlined">
      <Grid
        container
        item
        xs={12}
        sm={12}
        direction="row"
        className={classes.containerMargin}
      >
        {formatCode(code)}
      </Grid>
    </Paper>
  );
};
