// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React from "react";
import { Function, Method, Parameter, Shape, Type } from "../../model/model";
import DetailsList from "../general/DetailsList";
import { TypeView } from "./Type";

interface FunctionsProps {
  functions: (Function | Method)[];
  title: string;
  hideReturnTypes?: boolean;
}

export function getId(functionName: string, shape?: Shape): string {
  if (!shape) {
    return "";
  }
  if (shape.isSetter) {
    return encodeURIComponent(functionName + "=");
  }
  const shapeString = `${shape.arity},${shape.totalBlockCount},${
    shape.namedBlockCount
  },${shape.names.join(",")}`;
  return encodeURIComponent(functionName + "(" + shapeString + ")");
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
            <TypeView type={parameter.type} />
            {parameter.isRequired ? " " : "= "}
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
        const id = getId(fn.name, fn.shape);
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
