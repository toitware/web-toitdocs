import { makeStyles, Paper } from "@material-ui/core";
import "codemirror/lib/codemirror.css";
import React from "react";
import { UnControlled as CodeMirror } from "react-codemirror2";
import "../../assets/codemirror/codemirror.css";
import "../../assets/codemirror/toit";

const useStyles = makeStyles((theme) => ({
  paperCode: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    maxHeight: 400,
    display: "flex",
  },
}));

interface CodeBlockProps {
  code: string;
}

export default function CodeBlock(props: CodeBlockProps): JSX.Element {
  const classes = useStyles();
  return (
    <Paper className={classes.paperCode} elevation={0} variant="outlined">
      <CodeMirror
        value={props.code}
        options={{
          mode: "toit",
          readOnly: true,
          tabSize: 2,
        }}
      />
    </Paper>
  );
}
