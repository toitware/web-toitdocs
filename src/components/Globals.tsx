import React from "react";
import { ToitGlobal } from "../model/toitsdk";
import DetailsList from "./DetailsList";

interface GlobalsProps {
  globals: ToitGlobal[];
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
        };
      })}
    />
  );
}
