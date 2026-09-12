// Copyright (C) 2024 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import styled from "@emotion/styled";
import "codemirror/lib/codemirror.css";
import React from "react";
import "../../assets/codemirror/codemirror.css";
// The editor and its mode require a browser. Static pages keep code readable.
let CodeMirror: typeof import("react-codemirror2").UnControlled;
if (typeof window !== "undefined") {
  CodeMirror = require("react-codemirror2").UnControlled;
  require("../../assets/codemirror/toit");
}

const Wrapper = styled.div`
  .CodeMirror {
    background: #b0b8ed20;
    padding: 1rem;
    border-radius: 1em;
    margin-left: -1rem;
    margin-right: -1rem;
    width: auto;
  }
`;

interface CodeBlockProps {
  code: string;
}

export default function CodeBlock(props: CodeBlockProps): JSX.Element {
  if (typeof window === "undefined") {
    return <Wrapper><pre className="CodeMirror"><code>{props.code}</code></pre></Wrapper>;
  }
  return (
    <Wrapper>
      <CodeMirror
        value={props.code.replace(/^\n/, "").replace(/\n$/, "")}
        options={{
          mode: "toit",
          readOnly: true,
          tabSize: 2,
        }}
      />
    </Wrapper>
  );
}
