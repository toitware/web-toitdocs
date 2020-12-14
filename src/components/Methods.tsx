// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React from "react";
import Toitdocs from "./toitdoc_info";
import { ArrowRightAlt } from "@material-ui/icons";
import Box from "@material-ui/core/Box";
import { Parameters } from "./parameters";
import { Type } from "./util";
import { ToitFunction } from "../model/toitsdk";
import { Typography } from "@material-ui/core";
import { HashLink } from "react-router-hash-link";

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
              <ArrowRightAlt
                style={{
                  verticalAlign: "middle",
                  display: "inline-flex",
                }}
              />
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
