// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React from "react";
import { ToitFunction } from "../model/toitsdk";
import DetailsList from "./DetailsList";
import { Type } from "./Util";

interface FunctionsProps {
  functions: ToitFunction[];
  title: string;
  hideReturnTypes?: boolean;
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
      elements={props.functions.map((fn, i) => {
        const id = getId(fn);
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
