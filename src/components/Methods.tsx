// Copyright (C) 2020 Toitware ApS. All rights reserved.

import { makeStyles, Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { ArrowRightAlt } from "@material-ui/icons";
import React from "react";
import { HashLink } from "react-router-hash-link";
import { ToitFunction } from "../model/toitsdk";
import { Parameters } from "./parameters";
import Toitdocs from "./toitdoc_info";
import { Type } from "./util";

const useStyles = makeStyles((theme) => ({
  arrowRight: {
    verticalAlign: "middle",
    display: "inline-flex",
  },
}));

interface MethodsProps {
  functions: ToitFunction[];
}

function getId(fn: ToitFunction): string {
  const argsString = fn.parameters
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
  return encodeURIComponent(fn.name + "(" + argsString + ")");
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
          const id = getId(fn);
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
              <ArrowRightAlt className={classes.arrowRight} />
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
