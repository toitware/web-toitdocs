// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React from "react";
import Toitdocs from "./toitdoc_info";
import { ArrowRightAlt } from "@material-ui/icons";
import Box from "@material-ui/core/Box";
import { Parameters } from "./parameters";
import { Type } from "./util";
import { ToitFunction } from "../model/toitsdk";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

interface MethodsProps {
  functions: ToitFunction[];
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
          return (
            <Box p={1} bgcolor={background} borderRadius={8} key={"method" + i}>
              <Link to={{ hash: "#MyHash" }}>LINK</Link>
              <Typography variant="h6" component="span">
                {fn.name}
              </Typography>
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
