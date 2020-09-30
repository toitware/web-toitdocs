// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

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

function StatementsPrint(i, classes) {
  if ((i.statements !== undefined) & (i.statements !== null)) {
    i.statements.map((statements, j) => {
      if ((statements !== undefined) & (statements !== null)) {
        if (
          statements.text !== undefined ||
          statements.itemized !== undefined
        ) {
          if (statements.itemized) {
            return (
              <ul key={"statements_list_" + j}>
                {statements.itemized.map((item, k) => {
                  return (
                    <li key={k}>
                      {item.map((item_content, a) => {
                        if (item_content.is_code !== undefined) {
                          return (
                            <code className={classes.paper} key={a}>
                              {item_content.text}
                            </code>
                          );
                        } else if (item_content.is_code_section !== undefined) {
                          return (
                            <Paper
                              elevation={0}
                              variant="outlined"
                              className={classes.paperSection}
                              key={a}
                            >
                              <pre>
                                <code className={classes.paper} key={a}>
                                  {item_content.text}
                                </code>
                              </pre>
                            </Paper>
                          );
                        } else {
                          return item_content.text;
                        }
                      })}
                    </li>
                  );
                })}
              </ul>
            );
          } else {
            if (statements.is_code !== undefined) {
              return (
                <code className={classes.paper} key={j}>
                  {statements.text}
                </code>
              );
            } else if (
              (statements.is_code_section !== undefined) &
              (i.title !== "Examples")
            ) {
              {
                console.log(i);
              }
              return (
                <Paper
                  elevation={0}
                  variant="outlined"
                  className={classes.paperSection}
                  key={j}
                >
                  <pre>
                    <code>{statements.text}</code>
                  </pre>
                </Paper>
              );
            } else if (
              (statements.is_code_section !== undefined) &
              (i.title === "Examples")
            ) {
              return (
                <Paper>
                  <pre>
                    <code>{statements.text}</code>
                  </pre>
                </Paper>
              );
            } else {
              if (statements.path) {
                return (
                  <Link to={`/${statements.path}`} key={j}>
                    {statements.text}
                  </Link>
                );
              } else {
                return statements.text;
              }
            }
          }
        } else {
          return (
            <Grid item key={j}>
              {statements.map((content, n) => {
                if (content.itemized) {
                  return (
                    <ul key={n}>
                      {content.itemized.map((item, k) => {
                        return (
                          <li key={k}>
                            {item.map((item_content, b) => {
                              if (item_content.is_code !== undefined) {
                                return (
                                  <code className={classes.paper} key={b}>
                                    {item_content.text}
                                  </code>
                                );
                              } else if (
                                item_content.is_code_section !== undefined
                              ) {
                                return (
                                  <Paper
                                    elevation={0}
                                    variant="outlined"
                                    className={classes.paperSection}
                                    key={b}
                                  >
                                    <pre>
                                      <code>{item_content.text}</code>
                                    </pre>
                                  </Paper>
                                );
                              } else {
                                return item_content.text;
                              }
                            })}
                          </li>
                        );
                      })}
                    </ul>
                  );
                } else {
                  if (content.is_code !== undefined) {
                    return (
                      <code className={classes.paper} key={n}>
                        {content.text}
                      </code>
                    );
                  } else if (content.is_code_section !== undefined) {
                    return (
                      <Paper
                        elevation={0}
                        variant="outlined"
                        className={classes.paperSection}
                        key={n}
                      >
                        <pre>
                          <code>{content.text}</code>
                        </pre>
                      </Paper>
                    );
                  } else {
                    if (content.path) {
                      return (
                        <Link to={`/${content.path}`} key={n}>
                          {content.text}
                        </Link>
                      );
                    } else {
                      return content.text;
                    }
                  }
                }
              })}
            </Grid>
          );
        }
      }
    });
  }
}

//Function that prints the content of currently presented element

function Toitdocs(props) {
  const classes = useStyles();
  if (props.value !== undefined) {
    return props.value.map((i, s) => {
      return (
        <div className={classes.root} key={s}>
          <Grid container>
            <Grid item>
              <strong>{i.title}</strong>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item key={s}>
              {StatementsPrint(i, classes)}
            </Grid>
          </Grid>
        </div>
      );
    });
  } else {
    return null;
  }
}

export default Toitdocs;
