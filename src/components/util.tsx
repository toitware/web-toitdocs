import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ToitReference, ToitType } from "../model/toitsdk";

interface TypeProps {
  type: ToitType;
}

export class Type extends Component<TypeProps> {
  render(): JSX.Element {
    const type = this.props.type;
    if (type.is_none) {
      return <span>none</span>;
    }
    if (type.is_any) {
      return <span>any</span>;
    }
    if (type.is_block) {
      return <span>[block]</span>;
    }
    return (
      <span>
        <Reference reference={type.reference} />
      </span>
    );
  }
}

interface ReferenceProps {
  reference: ToitReference;
}

export class Reference extends Component<ReferenceProps> {
  render(): JSX.Element {
    const reference = this.props.reference;
    let path = "";
    this.props.reference.path.forEach((element) => {
      if (!path.endsWith(".") && element === "") {
        path = path + ".";
      } else if (path.endsWith(".")) {
        path = path + element;
      } else if (!path.endsWith("/") && element !== "") {
        path = path + "/" + element;
      } else {
        path = path + element;
      }
    });
    return <Link to={`${path}`}>{reference.name}</Link>;
  }
}
