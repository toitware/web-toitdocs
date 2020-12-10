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
    let url = this.props.reference.name;
    const path = this.props.reference.path;
    const pathLen = path.length;
    for (let i = pathLen - 1; i >= 0 && path[i] !== "lib"; i--) {
      url = path[i] + "/" + url;
    }
    return <Link to={`/${url}`}>{this.props.reference.name}</Link>;
  }
}
