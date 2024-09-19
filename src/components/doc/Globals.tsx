// Copyright (C) 2024 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import React from "react";
import { Global } from "../../model/model";
import DetailsList from "../general/DetailsList";

interface GlobalsProps {
  globals: Global[];
  title: string;
}

export default function Globals(props: GlobalsProps): JSX.Element {
  return (
    <DetailsList
      title={props.title}
      elements={props.globals.map((global, i) => {
        return {
          name: global.name,
          description: <></>,
          key: "global_" + i,
          id: global.name,
          toitdoc: global.toitdoc,
          isInherited: false,
        };
      })}
    />
  );
}
