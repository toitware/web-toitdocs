import { makeStyles } from "@material-ui/core";
import React from "react";
import { ToitParameter } from "../model/toitsdk";
import { Type } from "./Util";

const useStyles = makeStyles((theme) => ({
  isBlock: {
    backgroundColor: "#d2d2d2",
  },
  isNamed: {
    color: "blue",
  },
  param: {
    color: "#303030",
  },
}));

function Parameters(props: { parameters: ToitParameter[] }): JSX.Element {
  const classes = useStyles();
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
                className={parameter.is_named === true ? classes.isNamed : ""}
              >
                <span className={parameter.is_named ? classes.isNamed : ""}>
                  {param}
                  {"/"}
                  <Type type={parameter.type} />{" "}
                </span>
              </span>
            </span>
          );
        } else {
          return (
            <span key={i} className={classes.param}>
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
