import React from "react";
import { ToitField } from "../model/toitsdk";
import Toitdocs from "./toitdoc_info";
import { Type } from "./util";

interface FieldsProps {
  fields: ToitField[];
}

export default function Fields(props: FieldsProps): JSX.Element {
  return (
    <>
      {props.fields.map((field, index) => {
        return (
          <div key={"class_field_" + index}>
            <div className="functionName">
              <strong>{field.name}</strong>
              {field.type && (
                <>
                  / <Type type={field.type} />{" "}
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
