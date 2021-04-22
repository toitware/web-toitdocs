// Copyright (C) 2020 Toitware ApS. All rights reserved.

import { makeStyles, Typography } from "@material-ui/core";
import React from "react";
import {
  OBJECT_TYPE_EXPRESSION_CODE,
  OBJECT_TYPE_EXPRESSION_TEXT,
  OBJECT_TYPE_STATEMENT_CODE_SECTION,
  OBJECT_TYPE_STATEMENT_ITEMIZED,
  OBJECT_TYPE_STATEMENT_PARAGRAPH,
  OBJECT_TYPE_TOITDOCREF,
} from "../../generator/sdk";
import {
  Doc,
  DocExpression,
  DocExpressionCode,
  DocExpressionText,
  DocRef,
  DocSection,
  DocStatement,
  DocStatementCodeSection,
  DocStatementItem,
  DocStatementItemized,
  DocStatementParagraph,
} from "../../model/model";
import CodeBlock from "../general/CodeBlock";

// TODO: Pull all format and structure from old printStatements function (structure from old format: https://github.com/toitware/web-toitdocs/blob/e74e3d5478fb3fd350e28f7801d69b7f38a1d563/src/components/toitdoc_info.js#L26)

const useStyles = makeStyles((theme) => ({
  statementParagraph: { paddingBottom: theme.spacing(1) },
  sectionTitle: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
}));

function StatementCodeSection(props: {
  code: DocStatementCodeSection;
}): JSX.Element {
  return <CodeBlock code={props.code.text} />;
}

function ExpressionCode(props: { code: DocExpressionCode }): JSX.Element {
  return <code>{props.code.text}</code>;
}

function ExpressionText(props: { text: DocExpressionText }): JSX.Element {
  return <span>{props.text.text}</span>;
}

function StatementItemized(props: {
  itemized: DocStatementItemized;
}): JSX.Element {
  return (
    <ul>
      {props.itemized.items.map((item: DocStatementItem) =>
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
  statement: DocStatementParagraph;
}): JSX.Element {
  const classes = useStyles();
  return (
    <div className={classes.statementParagraph}>
      {props.statement.expressions.map((expr: DocExpression, index: number) => (
        <Expression key={"expression_" + index} expression={expr} />
      ))}
    </div>
  );
}

function ToitdocRef(props: { reference: DocRef }): JSX.Element {
  // TODO: Handle references to other objects.
  return <span>{props.reference.text}</span>;
}

function Expression(props: { expression: DocExpression }): JSX.Element {
  const expression = props.expression;
  switch (expression.object_type) {
    case OBJECT_TYPE_EXPRESSION_CODE:
      return <ExpressionCode code={expression} />;
    case OBJECT_TYPE_EXPRESSION_TEXT:
      return <ExpressionText text={expression} />;
    case OBJECT_TYPE_TOITDOCREF:
      return <ToitdocRef reference={expression} />;
    default:
      throw Error("unhandled expression: " + expression);
  }
}

function Statement(props: { statement: DocStatement }): JSX.Element {
  const statement = props.statement;
  switch (statement.object_type) {
    case OBJECT_TYPE_STATEMENT_PARAGRAPH:
      return <StatementParagraph statement={statement} />;
    case OBJECT_TYPE_STATEMENT_CODE_SECTION:
      return <StatementCodeSection code={statement} />;
    case OBJECT_TYPE_STATEMENT_ITEMIZED:
      return <StatementItemized itemized={statement} />;
    default:
      throw Error("unhandled statement: " + statement);
  }
}

function Section(props: { section: DocSection }): JSX.Element {
  const classes = useStyles();
  return (
    <>
      <Typography variant="h5" className={classes.sectionTitle}>
        {props.section.title}
      </Typography>
      {props.section.statements.map((statement, index) => (
        <Statement key={"statement_" + index} statement={statement} />
      ))}
    </>
  );
}

function headerToitdoc(toitdoc?: Doc): Doc | undefined {
  if (!toitdoc) return toitdoc;
  if (toitdoc.length === 0) return toitdoc;
  const first = toitdoc[0];
  const statements = first.statements;
  if (statements.length === 0) return undefined;
  return [
    {
      object_type: "section", // eslint-disable-line @typescript-eslint/camelcase
      title: "",
      statements: [statements[0]],
    },
  ];
}

// Function that prints the content of currently presented element.
function Toitdocs(props: {
  value?: Doc;
  headerOnly?: boolean;
}): JSX.Element | null {
  let value = props.value;
  if (props.headerOnly) {
    value = headerToitdoc(value);
  }
  if (!value) {
    return null;
  }
  return (
    <>
      {value.map((section, index) => (
        <Section key={"section_" + index} section={section} />
      ))}
    </>
  );
}

export default Toitdocs;
