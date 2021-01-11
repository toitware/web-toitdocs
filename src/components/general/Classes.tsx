import React from "react";
import { ToitClass } from "../../model/toitsdk";
import DetailsList from "../DetailsList";

interface ClassesProps {
  classes: ToitClass[];
  libName: string;
  moduleName: string;
  title: string;
}

export default function Classes(props: ClassesProps): JSX.Element {
  console.log(props);
  const unhiddenProps = {
    classes: props.classes.filter((elem) => elem.is_private === false),
    libName: props.libName,
    moduleName: props.moduleName,
    title: props.title,
  };
  console.log(unhiddenProps);
  return (
    <DetailsList
      title={unhiddenProps.title}
      elements={unhiddenProps.classes.map((klass, i) => {
        return {
          name: klass.name,
          description: <></>,
          key: "class_" + i,
          id: "",
          link:
            "/" +
            unhiddenProps.libName +
            "/" +
            unhiddenProps.moduleName +
            "/" +
            klass.name,
        };
      })}
    />
  );
}
