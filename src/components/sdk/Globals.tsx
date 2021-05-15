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
          isAbstract: false,
        };
      })}
    />
  );
}
