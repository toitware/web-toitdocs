import { Typography } from "@material-ui/core";
import React from "react";
import { HashLink } from "react-router-hash-link";
import { ToitField } from "../model/toitsdk";
import Toitdocs from "./ToitdocInfo";
import { Type } from "./Util";

interface FieldsProps {
  fields: ToitField[];
}

export default function Fields(props: FieldsProps): JSX.Element {
  return (
    <>
      {props.fields.map((field, index) => {
        return (
          <div key={"class_field_" + index} id={field.name}>
            <div className="functionName">
              <HashLink to={{ hash: field.name }}>
                <Typography variant="h6" component="span">
                  {field.name}
                </Typography>
              </HashLink>
              {field.type && (
                <>
                  /<Type type={field.type} />{" "}
                </>
              )}
            </div>
            {field.toitdoc && <Toitdocs value={field.toitdoc} />}
          </div>
        );
      })}
    </>
  );
}
