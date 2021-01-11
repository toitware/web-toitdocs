// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React from "react";
import { ToitFunction, ToitParameter } from "../model/toitsdk";
import DetailsList from "./DetailsList";
import { Type } from "./Util";

interface FunctionsProps {
  functions: ToitFunction[];
  title: string;
  hideReturnTypes?: boolean;
}

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

function getDescription(
  fn: ToitFunction,
  hideReturnTypes?: boolean
): JSX.Element {
  return (
    <>
      {fn.parameters.map((parameter, i) => {
        let param = parameter.name;
        if (parameter.is_named) {
          param = "--" + param;
        }
        if (parameter.is_block) {
          param = "[" + param + "]";
          return param;
        }

        return (
          <span key={i}>
            {param + "/"}
            <Type type={parameter.type} />{" "}
          </span>
        );
      })}
      {!hideReturnTypes && (
        <>
          <span>{" -> "}</span>
          <Type type={fn.return_type}></Type>
        </>
      )}
    </>
  );
}

export default function Functions(props: FunctionsProps): JSX.Element {
  return (
    <DetailsList
      title={props.title}
      elements={props.functions
        .filter((elem) => elem.is_private === false)
        .map((fn, i) => {
          const id = getId(fn.name, fn.parameters);
          return {
            name: fn.name,
            description: getDescription(fn, props.hideReturnTypes),
            key: "function" + i,
            id: id,
            toitdoc: fn.toitdoc,
          };
        })}
    />
  );
}
