import React from "react";
import { Type } from "./util";

function Parameters(props) {
  const styling = [];
  styling[0] = "<b>";
  styling[1] = "</b>";
  return props.value.map((parameter, i) => {
    let param;
    if (parameter.is_required) {
      param = `${parameter.name}`;
    } else {
      param = `${parameter.name}=`;
    }
    if (parameter.is_named) {
      param = `--${param}`;
      styling[0] = "<b>";
      styling[1] = "</b>";
    }
    if (parameter.is_block) {
      param = `[${param}] `;
      return param;
    }

    if (!parameter.type.is_none && parameter.type.is_any) {
      return (
        <span key={i}>
          <span style={parameter.is_named === true ? { color: "blue" } : {}}>
            <span
              style={
                parameter.is_block === true
                  ? { backgroundColor: "#d2d2d2" }
                  : {}
              }
            >
              {param}
              {"/"}
              <Type type={parameter.type} />{" "}
            </span>
          </span>
        </span>
      );
    } else {
      return (
        <span key={i} style={{ color: "#303030" }}>
          {param}
          {"/"}
          <Type type={parameter.type} />
        </span>
      );
    }
  });
}

export { Parameters };
