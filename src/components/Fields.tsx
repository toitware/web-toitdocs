import React from "react";
import { Field } from "../model/model";
import DetailsList from "./DetailsList";
import { TypeView } from "./Util";

interface FieldsProps {
  fields: Field[];
}

export default function Fields(props: FieldsProps): JSX.Element {
  return (
    <DetailsList
      title="Fields"
      elements={props.fields.map((field, i) => {
        return {
          name: field.name,
          description: <TypeView type={field.type} />,
          key: "field_" + i,
          id: field.name,
          toitdoc: field.toitdoc,
        };
      })}
    />
  );
}
