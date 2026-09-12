// Copyright (C) 2024 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/doc";
import { classFrom, classUrlFromRef } from "../../misc/util";
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

export function TypeReference(props: TypeReferenceProps): JSX.Element {
  const libraries = useSelector((state: RootState) => state.doc.libraries || {});
  const ref = props.reference;
  const name = ref.name;
  if (name.endsWith("_") && (ref.libraryRef.baseUrl !== "" ||
      !classFrom(ref.libraryRef.path.join("/"), name, libraries))) {
    return <span title="Private class documentation is not included.">{name}</span>;
  }
  const url = classUrlFromRef(ref);
  if (ref.libraryRef.baseUrl !== "") return <ExternalLink to={url} text={name} />;
  return <Link to={url}>{name}</Link>;
}
