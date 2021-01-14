import React from "react";
import { ToitClass } from "../../generator/sdk";
import DetailsList from "../DetailsList";

interface ClassesProps {
  classes: ToitClass[];
  libName: string;
  moduleName: string;
  title: string;
}

export default function Classes(props: ClassesProps): JSX.Element {
  return (
    <DetailsList
      title={props.title}
      elements={props.classes.map((klass, i) => {
        return {
          name: klass.name,
          description: <></>,
          key: "class_" + i,
          id: "",
          link: "/" + props.libName + "/" + props.moduleName + "/" + klass.name,
        };
      })}
    />
  );
}
