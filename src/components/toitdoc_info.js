// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import {
  OBJECT_TYPE_STATEMENT_PARAGRAPH,
  OBJECT_TYPE_STATEMENT_CODE,
  OBJECT_TYPE_STATEMENT_CODE_SECTION,
  OBJECT_TYPE_STATEMENT_ITEMIZED,
  OBJECT_TYPE_TOITDOCREF,
} from "./../sdk.js";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    backgroundColor: "#9d9d9c11",
    border: "1px solid rgba(0, 0, 0, 0.12)",
    borderRadius: "4px",
    padding: "2px",
  },
  paperSection: {
    padding: theme.spacing(1),
    width: "auto",
    backgroundColor: "#9d9d9c11",
  },
}));

// TODO: Pull all format and structure from old printStatements function (structure from old format: https://github.com/toitware/web-toitdocs/blob/e74e3d5478fb3fd350e28f7801d69b7f38a1d563/src/components/toitdoc_info.js#L26)

function StatementCodeSection({code, classes}) {
  return (<Paper
    elevation={0}
    variant="outlined"
    className={classes.paperSection}
  >
    <pre>
      <code>{code.text}</code>
    </pre>
  </Paper>)
}

function StatementCode({code, classes}) {
  return <span className={classes.paper}>{code.text}</span>
}

function StatementItemized({items, classes}) {
  return <ul>
    {items.items.forEach((item) => item.statements.forEach((statement) =>
      <li><Statement statement={statement} classes={classes} /></li>
    ))}
  </ul>
}

function StatementParagraph({statement, classes}) {
  return statement.expressions.map((expr) => <Expression expr={expr} classes={classes} />);
}

function ToitdocRef({reference, classes}) {
  // TODO: Handle references to other objects.
  return <span>{reference.text}</span>
}

function Expression({expr, classes}) {
  switch (expr.object_type) {
    case OBJECT_TYPE_STATEMENT_CODE:
      return <StatementCode code={expr} classes={classes} />
    case OBJECT_TYPE_STATEMENT_CODE_SECTION:
      return <StatementCodeSection code={expr} classes={classes} />
    case OBJECT_TYPE_TOITDOCREF:
      return <ToitdocRef reference={expr} classes={classes} />
    default:
      console.log("unhandled expression", expr);
      return null;
  }
}

function Statement({statement, classes}) {
  switch (statement.object_type) {
    case OBJECT_TYPE_STATEMENT_PARAGRAPH:
      return <StatementParagraph statement={statement} classes={classes} />
    case OBJECT_TYPE_STATEMENT_CODE_SECTION:
      return <StatementCodeSection code={statement} classes={classes} />
    case OBJECT_TYPE_STATEMENT_ITEMIZED:
      return <StatementItemized items={statement} classes={classes} />
    default:
      console.log("unhandled statement", statement);
      return null;
  }
}

function Section({section, classes}) {
  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item>
          <strong>{section.title}</strong>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item>
          {section.statements.map((statement) => <Statement statement={statement} classes={classes} />)}
        </Grid>
      </Grid>
    </div>
  );
}

// Function that prints the content of currently presented element.
function Toitdocs(props) {
  const classes = useStyles();
  if (!props.value) {
    return null;
  }
  return props.value.map((section) => <Section section={section} classes={classes} />);
}

export default Toitdocs;
