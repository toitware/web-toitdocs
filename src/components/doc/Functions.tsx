// Copyright (C) 2020 Toitware ApS. All rights reserved.

import { makeStyles } from "@material-ui/core";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import React from "react";
import { getFunctionId } from "../../misc/util";
import { Function, Method, Parameter, Type } from "../../model/model";
import DetailsList from "../general/DetailsList";
import { TypeView } from "./Type";

const useStyles = makeStyles((theme) => ({
  defaultValue: { fontSize: "0.875em" }
}));

interface FunctionsProps {
  functions: (Function | Method)[];
  title: string;
  hideReturnTypes?: boolean;
}

export function getDescription(
  parameters: Parameter[],
  returnType?: Type,
  hideReturnTypes?: boolean,
  includeDefaultValues?: boolean,
  classes?: ClassNameMap<"defaultValue">
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
            {!parameter.isRequired && (
              <>
                {"="}
                {includeDefaultValues && (
                  <span className={classes!.defaultValue}>{parameter.defaultValue}</span>
                )}{" "}
              </>
            )}{" "}
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
  const classes = useStyles();
  return (
    <DetailsList
      title={props.title}
      elements={props.functions.map((fn, i) => {
        const id = getFunctionId(fn.name, fn.shape);
        return {
          name: fn.name,
          description: getDescription(
            fn.parameters,
            fn.returnType,
            props.hideReturnTypes,
            true,
            classes
          ),
          key: "function" + i,
          id: id,
          toitdoc: fn.toitdoc,
          isInherited: fn.isInherited,
        };
      })}
    />
  );
}
