// Copyright (C) 2024 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import React from "react";
import "./ExternalLink.css";

export default function ExternalLink(props: {
  to: string;
  text: string;
}): JSX.Element {
  return (
    <>
      <span className="external-container">
        <a href={props.to} className="external">
          {props.text}
        </a>
        <span className="external-link-icon" aria-hidden="true"></span>
      </span>
    </>
  );
}
