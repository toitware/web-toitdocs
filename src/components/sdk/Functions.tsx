// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React from "react";
import { Function, Method, Parameter, Type } from "../../model/model";
import DetailsList from "../general/DetailsList";
import { TypeView } from "./Type";

interface FunctionsProps {
  functions: (Function | Method)[];
  title: string;
  hideReturnTypes?: boolean;
}

export function getId(functionName: string, parameters: Parameter[]): string {
  const argsString = parameters
    .map((p) => {
      if (p.type.isAny) {
        return "any";
      } else if (p.type.isNone) {
        return "none";
      } else if (p.type.isBlock) {
        return "block";
      } else if (p.type) {
        return p.type.reference?.name || "unknown";
      } else {
        return "unknown";
      }
    })
    .join(",");
  return encodeURIComponent(functionName + "(" + argsString + ")");
}

export function getDescription(
  parameters: Parameter[],
  returnType?: Type,
  hideReturnTypes?: boolean
): JSX.Element {
  return (
    <>
      {parameters.map((parameter, i) => {
        let param = parameter.name;
        if (parameter.isNamed) {
          param = "--" + param;
        }
        if (parameter.isBlock) {
          param = "[" + param + "] ";
          return param;
        }

        return (
          <span key={i}>
            {param + "/"}
            <TypeView type={parameter.type} />{" "}
          </span>
        );
      })}
      {!hideReturnTypes && returnType && (
        <>
          <span>{" -> "}</span>
          <TypeView type={returnType} />
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
        const id = getId(fn.name, fn.parameters);
        return {
          name: fn.name,
          description: getDescription(
            fn.parameters,
            fn.returnType,
            props.hideReturnTypes
          ),
          key: "function" + i,
          id: id,
          toitdoc: fn.toitdoc,
        };
      })}
    />
  );
}
