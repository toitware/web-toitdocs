// Copyright (C) 2024 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import React from "react";
import { getFieldId } from "../../misc/util";
import { Field } from "../../model/model";
import DetailsList from "../general/DetailsList";
import { TypeView } from "./Type";

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
          description: (
            <>
              / <TypeView type={field.type} />
            </>
          ),
          key: "field_" + i,
          id: getFieldId(field.name),
          toitdoc: field.toitdoc,
          isInherited: field.isInherited,
        };
      })}
    />
  );
}
