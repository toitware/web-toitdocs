import React, { Component } from "react";
import { Link } from "react-router-dom";
import { classUrlFromRef } from "../../misc/util";
import { Type } from "../../model/model";
import { TopLevelItemRef } from "../../model/reference";

interface TypeProps {
  type: Type;
}

export class TypeView extends Component<TypeProps> {
  render(): JSX.Element {
    const type = this.props.type;
    if (type.isNone) {
      return <span>none</span>;
    }
    if (type.isAny) {
      return <span>any</span>;
    }
    if (type.isBlock) {
      return <span>[block]</span>;
    }
    if (type.reference) {
      return <TypeReference reference={type.reference} />;
    }
    return <></>;
  }
}

interface TypeReferenceProps {
  reference: TopLevelItemRef;
}

export class TypeReference extends Component<TypeReferenceProps> {
  render(): JSX.Element {
    return (
      <Link to={classUrlFromRef(this.props.reference)}>
        {this.props.reference.name}
      </Link>
    );
  }
}
