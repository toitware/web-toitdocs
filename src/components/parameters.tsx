import React from "react";
import { ToitParameter } from "../model/toitsdk";
import { Type } from "./util";

function Parameters(props: { parameters: ToitParameter[] }): JSX.Element {
  return (
    <>
      {" "}
      {props.parameters.map((parameter, i) => {
        let param;
        if (parameter.is_required) {
          param = parameter.name;
        } else {
          param = parameter.name + "=";
        }
        if (parameter.is_named) {
          param = "--" + param;
        }
        if (parameter.is_block) {
          param = "[" + param + "]";
          return param;
        }

        if (!parameter.type.is_none && parameter.type.is_any) {
          return (
            <span key={i}>
              <span
                style={parameter.is_named === true ? { color: "blue" } : {}}
              >
                <span
                  style={
                    parameter.is_block ? { backgroundColor: "#d2d2d2" } : {}
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
      })}
    </>
  );
}

export { Parameters };
