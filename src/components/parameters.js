import { Link } from "react-router-dom";
import React from "react";

function Parameters(props) {
  let styling = [];
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

    if (parameter.type !== "none" && parameter.type !== "any") {
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
              <Link to={`/${parameter.type_path}/${parameter.type}`}>
                {parameter.type}
              </Link>{" "}
            </span>
          </span>
        </span>
      );
    } else {
      return (
        <span key={i} style={{ color: "#303030" }}>
          {param}
          {"/"}
          {parameter.type}{" "}
        </span>
      );
    }
  });
}

export { Parameters };
