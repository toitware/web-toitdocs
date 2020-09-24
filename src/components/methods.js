// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React from "react";
import Toitdocs from "./toitdoc_info";
import { ArrowRightAlt } from "@material-ui/icons";
import Box from "@material-ui/core/Box";
import { Link } from "react-router-dom";
import { Parameters } from "./parameters";

function ReturnType({ returnType, returnPath }) {
  if (returnType !== "none" && returnType !== "any") {
    return (
      <span>
        <Link to={`/${returnPath}/${returnType}`}>{returnType}</Link>
      </span>
    );
  } else {
    return <span>{returnType}</span>;
  }
}

function Methods(props) {
  if (props.value !== undefined) {
    let iterator = 0;
    return []
      .concat(props.value)
      .sort((a, b) => a.function_name.localeCompare(b.function_name))
      .map((functions, index) => {
        iterator++;
        var background;
        if (iterator % 2) {
          background = "#eeeeee";
        } else {
          background = "#fafafa";
        }
        return (
          <div key={`${functions.function_name}_${index}`}>
            <Box p={1} bgcolor={background} borderRadius={8}>
              <span className="functionName">
                <Link
                  to={`/${props.libName}/${props.moduleName}/${props.className}/${props.functionType}/${functions.function_name}/${index}`}
                >
                  <strong>{`${functions.function_name} `}</strong>
                </Link>
              </span>
              <Parameters value={functions.parameters} />
              <ArrowRightAlt
                style={{
                  verticalAlign: "middle",
                  display: "inline-flex",
                }}
              />
              <span>
                <ReturnType
                  returnType={functions.return_type}
                  returnPath={functions.return_path}
                />
              </span>
              <Toitdocs value={functions.function_toitdoc} />
            </Box>
          </div>
        );
      });
  } else {
    return null;
  }
}

function MethodsInModules(props) {
  if (props.value.module_functions !== undefined) {
    let iterator = 0;
    return []
      .concat(props.value.module_functions)
      .sort((a, b) => a.function_name.localeCompare(b.function_name))
      .map((functions, index) => {
        iterator++;
        var background;
        if (iterator % 2) {
          background = "#eeeeee";
        } else {
          background = "#fafafa";
        }
        return (
          <div key={`${functions.function_name}_${index}`}>
            <Box p={1} bgcolor={background} borderRadius={8}>
              <span className="functionName">
                <code>{`${functions.function_name} `}</code>
              </span>
              <Parameters value={functions.parameters} />
              <ArrowRightAlt
                style={{
                  verticalAlign: "middle",
                  display: "inline-flex",
                }}
              />
              <span>
                <ReturnType
                  returnType={functions.return_type}
                  returnPath={functions.return_path}
                />
              </span>
              <Toitdocs value={functions.function_toitdoc} />
            </Box>
          </div>
        );
      });
  } else {
    return null;
  }
}
export { Methods, MethodsInModules };
