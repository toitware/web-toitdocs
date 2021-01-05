// Copyright (C) 2020 Toitware ApS. All rights reserved.

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import React from "react";
import {
  ToitDoc,
  ToitDocRef,
  ToitExpression,
  ToitSection,
  ToitStatement,
  ToitStatementCode,
  ToitStatementCodeSection,
  ToitStatementItem,
  ToitStatementItemized,
  ToitStatementParagraph,
} from "../model/toitsdk";
import {
  OBJECT_TYPE_STATEMENT_CODE,
  OBJECT_TYPE_STATEMENT_CODE_SECTION,
  OBJECT_TYPE_STATEMENT_ITEMIZED,
  OBJECT_TYPE_STATEMENT_PARAGRAPH,
  OBJECT_TYPE_TOITDOCREF,
} from "../sdk";

// TODO: Pull all format and structure from old printStatements function (structure from old format: https://github.com/toitware/web-toitdocs/blob/e74e3d5478fb3fd350e28f7801d69b7f38a1d563/src/components/toitdoc_info.js#L26)

function StatementCodeSection(props: {
  code: ToitStatementCodeSection;
}): JSX.Element {
  return (
    <Paper elevation={0} variant="outlined">
      <pre>
        <code>{props.code.text}</code>
      </pre>
    </Paper>
  );
}

function StatementCode(props: { code: ToitStatementCode }): JSX.Element {
  return <span>{props.code.text}</span>;
}

function StatementItemized(props: {
  itemized: ToitStatementItemized;
}): JSX.Element {
  return (
    <ul>
      {props.itemized.items.map((item: ToitStatementItem) =>
        item.statements.map((statement, index) => (
          <li key={index}>
            <Statement statement={statement} />
          </li>
        ))
      )}
    </ul>
  );
}

function StatementParagraph(props: {
  statement: ToitStatementParagraph;
}): JSX.Element {
  return (
    <>
      {props.statement.expressions.map(
        (expr: ToitExpression, index: number) => (
          <Expression key={"expression_" + index} expression={expr} />
        )
      )}
    </>
  );
}

function ToitdocRef(props: { reference: ToitDocRef }): JSX.Element {
  // TODO: Handle references to other objects.
  return <span>{props.reference.text}</span>;
}

function Expression(props: { expression: ToitExpression }): JSX.Element {
  const expression = props.expression;
  switch (expression.object_type) {
    case OBJECT_TYPE_STATEMENT_CODE:
      return <StatementCode code={expression as ToitStatementCode} />;
    case OBJECT_TYPE_STATEMENT_CODE_SECTION:
      return (
        <StatementCodeSection code={expression as ToitStatementCodeSection} />
      );
    case OBJECT_TYPE_TOITDOCREF:
      return <ToitdocRef reference={expression as ToitDocRef} />;
    default:
      throw Error("unhandled expression: " + expression);
  }
}

function Statement(props: { statement: ToitStatement }): JSX.Element {
  const statement = props.statement;
  switch (statement.object_type) {
    case OBJECT_TYPE_STATEMENT_PARAGRAPH:
      return (
        <StatementParagraph statement={statement as ToitStatementParagraph} />
      );
    case OBJECT_TYPE_STATEMENT_CODE_SECTION:
      return (
        <StatementCodeSection code={statement as ToitStatementCodeSection} />
      );
    case OBJECT_TYPE_STATEMENT_ITEMIZED:
      return (
        <StatementItemized itemized={statement as ToitStatementItemized} />
      );
    default:
      throw Error("unhandled statement: " + statement);
  }
}

function Section(props: { section: ToitSection }): JSX.Element {
  return (
    <>
      <Grid container>
        <Grid item>
          <strong>{props.section.title}</strong>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item>
          {props.section.statements.map((statement, index) => (
            <Statement key={"statement_" + index} statement={statement} />
          ))}
        </Grid>
      </Grid>
    </>
  );
}

// Function that prints the content of currently presented element.
function Toitdocs(props: { value: ToitDoc }): JSX.Element | null {
  if (!props.value) {
    return null;
  }
  return (
    <>
      {props.value.map((section, index) => (
        <Section key={"section_" + index} section={section} />
      ))}
    </>
  );
}

export default Toitdocs;
