// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React from "react";
import Toitdocs from "./toitdoc_info";
import { ArrowRightAlt } from "@material-ui/icons";
import Box from "@material-ui/core/Box";
import { Link } from "react-router-dom";
import { Parameters } from "./parameters";
import { Type } from "./util";
import { ToitFunction } from "../model/toitsdk";

function ConditionalLink(props: {
  function: ToitFunction;
  functionIndex: number;
  props: MethodsProps;
}): JSX.Element {
  const restrictedSigns = ["/", "%"];
  if (!restrictedSigns.includes(props.function.name)) {
    return (
      <Link
        to={`/${props.props.libName}/${props.props.moduleName}/${props.props.className}/${props.props.functionType}/${props.function.name}/${props.functionIndex}`}
      >
        <strong>{`${props.function.name} `}</strong>
      </Link>
    );
  } else {
    return <strong>{`${props.function.name} `}</strong>;
  }
}

export type FunctionType = "Constructors" | "Statics" | "Factories" | "Methods";

interface MethodsProps {
  functions: ToitFunction[];
  libName: string;
  moduleName: string;
  className: string;
  functionType: FunctionType;
}

function Methods(props: MethodsProps): JSX.Element {
  return (
    <>
      {props.functions
        .concat([])
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((fn, i) => {
          // Alternating background.
          const background = i % 2 ? "#eeeeee" : "#fafafa";
          return (
            <div key={`${fn.name}_${i}`}>
              <Box p={1} bgcolor={background} borderRadius={8}>
                <span className="functionName">
                  <ConditionalLink
                    props={props}
                    function={fn}
                    functionIndex={i}
                  />
                </span>
                <Parameters value={fn.parameters} />
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
            </div>
          );
        })}
    </>
  );
}

function FunctionsInModules(props: { functions: ToitFunction[] }): JSX.Element {
  return (
    <>
      {props.functions
        .concat([])
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((fn, i) => {
          // Alternating background.
          const background = i % 2 ? "#eeeeee" : "#fafafa";
          return (
            <div key={`${fn.name}_${i}`}>
              <Box p={1} bgcolor={background} borderRadius={8}>
                <span className="functionName">
                  <code>{`${fn.name} `}</code>
                </span>
                <Parameters value={fn.parameters} />
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
            </div>
          );
        })}
    </>
  );
}
export { Methods, FunctionsInModules };
