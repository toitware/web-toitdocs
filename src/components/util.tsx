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
    // TODO handle the reference for the type
    const reference = this.props.reference;
    return <Link to={`/#todo`}>{reference.name}</Link>;
  }
}
