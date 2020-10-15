// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React from "react";
import Toitdocs from "./toitdoc_info";
import { ArrowRightAlt } from "@material-ui/icons";
import Box from "@material-ui/core/Box";
import { Link } from "react-router-dom";
import { Parameters } from "./parameters";

function ReturnType({ type, path }) {
  if (type !== "none" && type !== "any") {
    return (
      <span>
        <Link to={`/${path}/${type}`}>{type}</Link>
      </span>
    );
  } else {
    return <span>{type}</span>;
  }
}


function ConditionalLink(props){
  let restricted_signs = ["/", "%"];
  if(!restricted_signs.includes(props.function.name)){
    return (<Link
      to={`/${props.props.libName}/${props.props.moduleName}/${props.props.className}/${props.props.functionType}/${props.function.name}/${props.function_index}`}
    >
      <strong>{`${props.function.name} `}</strong>
    </Link>)
  } else {
    return (
      <strong>{`${props.function.name} `}</strong>
    )
  }
}

function Methods(props) {
  return []
    .concat(props.value)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((fn, i) => {
      // Alternating background.
      const background = (i % 2 ? "#eeeeee" :  "#fafafa");
      return (
        <div key={`${fn.name}_${indexedDB}`}>
          <Box p={1} bgcolor={background} borderRadius={8}>
            <span className="functionName">
              <ConditionalLink props={props} function={fn} function_index={i}/>
            </span>
            <Parameters value={fn.parameters} />
            <ArrowRightAlt
              style={{
                verticalAlign: "middle",
                display: "inline-flex",
              }}
            />
            <span>
              <ReturnType
                returnType={fn.return_type}
                returnPath={fn.return_type_path}
              />
            </span>
            <Toitdocs value={fn.toitdoc} />
          </Box>
        </div>
      );
    });
}

function FunctionsInModules(props) {
  return []
    .concat(props.functions)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((fn, i) => {
      // Alternating background.
      const background = (i % 2 ? "#eeeeee" :  "#fafafa");
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
              <ReturnType
                returnType={fn.return_type}
                returnPath={fn.return_type_path}
              />
            </span>
            <Toitdocs value={fn.toitdoc} />
          </Box>
        </div>
      );
    });
}
export { Methods, FunctionsInModules };
