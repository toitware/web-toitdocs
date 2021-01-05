// Copyright (C) 2020 Toitware ApS. All rights reserved.

import { makeStyles, Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { ArrowRightAlt } from "@material-ui/icons";
import React from "react";
import { HashLink } from "react-router-hash-link";
import { ToitFunction, ToitParameter } from "../model/toitsdk";
import { Parameters } from "./Parameters";
import Toitdocs from "./ToitdocInfo";
import { Type } from "./Util";
interface MethodsProps {
  functions: ToitFunction[];
}

const useStyles = makeStyles((theme) => ({
  arrowRightAlt: {
    verticalAlign: "middle",
    display: "inline-flex",
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
    <>
      {props.functions
        .concat([])
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((fn, i) => {
          // Alternating background.
          const background = i % 2 ? "#eeeeee" : "#fafafa";
          const id = getId(fn.name, fn.parameters);
          return (
            <Box
              p={1}
              bgcolor={background}
              borderRadius={8}
              key={"method" + i}
              id={id}
            >
              <HashLink to={{ hash: id }}>
                <Typography variant="h6" component="span">
                  {fn.name}
                </Typography>
              </HashLink>
              <Parameters parameters={fn.parameters} />
              <ArrowRightAlt className={classes.arrowRightAlt} />
              <span>
                <Type type={fn.return_type}></Type>
              </span>
              <Toitdocs value={fn.toitdoc} />
            </Box>
          );
        })}
    </>
  );
}
