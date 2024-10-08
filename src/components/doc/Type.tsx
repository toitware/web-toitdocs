// Copyright (C) 2024 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { classUrlFromRef } from "../../misc/util";
import { Type } from "../../model/model";
import { TopLevelItemRef } from "../../model/reference";
import ExternalLink from "../general/ExternalLink";

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
    const url = classUrlFromRef(this.props.reference);
    const name = this.props.reference.name;
    if (this.props.reference.libraryRef.baseUrl !== "") {
      return <ExternalLink to={url} text={name}></ExternalLink>;
    }
    return <Link to={url}>{name}</Link>;
  }
}
