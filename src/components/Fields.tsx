import React from "react";
import { ToitField } from "../model/toitsdk";
import DetailsList from "./DetailsList";
import { Type } from "./Util";

interface FieldsProps {
  fields: ToitField[];
}

export default function Fields(props: FieldsProps): JSX.Element {
  return (
    <DetailsList
      title="Fields"
      elements={props.fields.map((field, i) => {
        return {
          name: field.name,
          description: <Type type={field.type} />,
          key: "field_" + i,
          id: field.name,
          toitdoc: field.toitdoc,
        };
      })}
    />
  );
}
