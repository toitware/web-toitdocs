// Copyright (C) 2020 Toitware ApS. All rights reserved.

import { Divider, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { HashLink } from "react-router-hash-link";
import { ToitFunction, ToitParameter } from "../model/toitsdk";
import { Parameters } from "./Parameters";
import Toitdocs from "./ToitdocInfo";
import { Type } from "./Util";
interface MethodsProps {
  functions: ToitFunction[];
  title: string;
  hideReturnTypes?: boolean;
}

const useStyles = makeStyles((theme) => ({
  methods: { paddingBottom: theme.spacing(3) },
  title: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    color: theme.palette.primary.dark,
  },
  method: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  toitdocs: {
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
}));

export function getId(
  functionName: string,
  parameters: ToitParameter[]
): string {
  const argsString = parameters
    .map((p) => {
      if (p.type.is_any) {
        return "any";
      } else if (p.type.is_none) {
        return "none";
      } else if (p.type.is_block) {
        return "block";
      } else if (p.type) {
        return p.type.reference.name;
      } else {
        return "unknown";
      }
    })
    .join(",");
  return encodeURIComponent(functionName + "(" + argsString + ")");
}

export default function Methods(props: MethodsProps): JSX.Element {
  const classes = useStyles();
  return (
    <div className={classes.methods}>
      <div className={classes.title}>
        <Typography variant="h4">{props.title}</Typography>
      </div>
      <Divider />
      {props.functions
        .concat([])
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((fn, i) => {
          const id = getId(fn.name, fn.parameters);
          return (
            <div key={"method" + i} id={id}>
              <div className={classes.method}>
                <div>
                  <HashLink to={{ hash: id }}>{fn.name}</HashLink>
                  <Parameters parameters={fn.parameters} />
                  {!props.hideReturnTypes && (
                    <>
                      <span>{" -> "}</span>
                      <Type type={fn.return_type}></Type>
                    </>
                  )}
                </div>
                {fn.toitdoc && (
                  <div className={classes.toitdocs}>
                    <Toitdocs value={fn.toitdoc} />
                  </div>
                )}
              </div>
              <Divider />
            </div>
          );
        })}
    </div>
  );
}
