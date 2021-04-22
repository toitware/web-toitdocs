import React from "react";
import { classUrlFromRef } from "../../misc/util";
import { Class } from "../../model/model";
import DetailsList from "../general/DetailsList";

interface ClassesProps {
  classes: Class[];
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
          link: classUrlFromRef(klass.id),
          toitdoc: klass.toitdoc,
          toitdocHeaderOnly: true,
        };
      })}
    />
  );
}
