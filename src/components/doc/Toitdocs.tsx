// Copyright (C) 2020 Toitware ApS. All rights reserved.

import { makeStyles, Typography } from "@material-ui/core";
import { Variant } from "@material-ui/core/styles/createTypography";
import React from "react";
import { HashLink } from "react-router-hash-link";
import { urlFromLinkRef } from "../../misc/util";
import {
  Doc,
  DOC_DOCREF,
  DOC_EXPRESSION_CODE,
  DOC_EXPRESSION_LINK,
  DOC_EXPRESSION_TEXT,
  DOC_STATEMENT_CODE_SECTION,
  DOC_STATEMENT_ITEMIZED,
  DOC_STATEMENT_PARAGRAPH,
  DocExpression,
  DocExpressionCode,
  DocExpressionLink,
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
  otherDocRef: {
    fontWeight: 590,
  },
  parameterDocRef: {
    fontWeight: 590,
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

function ExpressionLink(props: { link: DocExpressionLink }): JSX.Element {
  return (
    <a href={props.link.url} target="_blank" rel="noopener noreferrer">
      {props.link.text}
    </a>
  );
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
  isHeader?: boolean;
}): JSX.Element {
  const classes = useStyles();
  return (
    <div className={props.isHeader ? "" : classes.statementParagraph}>
      {props.statement.expressions.map((expr: DocExpression, index: number) => (
        <Expression key={"expression_" + index} expression={expr} />
      ))}
    </div>
  );
}

function ToitdocRef(props: { reference: DocRef }): JSX.Element {
  const classes = useStyles();
  const url = urlFromLinkRef(props.reference.reference);
  if (!url) {
    let className: string;
    switch (props.reference.reference.kind) {
      case "parameter":
        className = classes.parameterDocRef;
        break;
      default:
        className = classes.otherDocRef;
    }
    return <span className={className}>{props.reference.text}</span>;
  }
  if (props.reference.reference.baseUrl !== "") {
    return <a href={url}>{props.reference.text}</a>;
  }
  return <HashLink to={url}>{props.reference.text}</HashLink>;
}

function Expression(props: { expression: DocExpression }): JSX.Element {
  const expression = props.expression;
  switch (expression.type) {
    case DOC_EXPRESSION_CODE:
      return <ExpressionCode code={expression} />;
    case DOC_EXPRESSION_TEXT:
      return <ExpressionText text={expression} />;
    case DOC_EXPRESSION_LINK:
      return <ExpressionLink link={expression} />;
    case DOC_DOCREF:
      return <ToitdocRef reference={expression} />;
    default:
      throw Error("unhandled expression: " + expression);
  }
}

function Statement(props: {
  statement: DocStatement;
  isHeader?: boolean;
}): JSX.Element {
  const statement = props.statement;
  switch (statement.type) {
    case DOC_STATEMENT_PARAGRAPH:
      return (
        <StatementParagraph isHeader={props.isHeader} statement={statement} />
      );
    case DOC_STATEMENT_CODE_SECTION:
      return <StatementCodeSection code={statement} />;
    case DOC_STATEMENT_ITEMIZED:
      return <StatementItemized itemized={statement} />;
    default:
      throw Error("unhandled statement: " + statement);
  }
}

function Section(props: { section: DocSection }): JSX.Element {
  const classes = useStyles();
  let level = props.section.level;
  if (level > 2) level = 2;
  const variant = ("h" + (props.section.level + 4)) as Variant;
  return (
    <>
      <Typography variant={variant} className={classes.sectionTitle}>
        {props.section.title}
      </Typography>
      {props.section.statements.map((statement, index) => (
        <Statement key={"statement_" + index} statement={statement} />
      ))}
    </>
  );
}

function headerToitdoc(toitdoc?: Doc): DocStatement | undefined {
  if (!toitdoc) return toitdoc;
  if (toitdoc.length === 0) return undefined;
  const first = toitdoc[0];
  const statements = first.statements;
  if (statements.length === 0) return undefined;
  return statements[0];
}

// Function that prints the content of currently presented element.
function Toitdocs(props: {
  value?: Doc;
  headerOnly?: boolean;
}): JSX.Element | null {
  if (props.headerOnly) {
    const statement = headerToitdoc(props.value);
    if (!statement) return null;
    return (
      <Statement
        key="statement_0"
        isHeader={props.headerOnly}
        statement={statement}
      />
    );
  }
  const value = props.value;
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
