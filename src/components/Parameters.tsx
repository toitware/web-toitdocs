import React from "react";
import { ToitParameter } from "../model/toitsdk";
import { Type } from "./Util";

function Parameters(props: { parameters: ToitParameter[] }): JSX.Element {
  return (
    <>
      {" "}
      {props.parameters.map((parameter, i) => {
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
    </>
  );
}

export { Parameters };
