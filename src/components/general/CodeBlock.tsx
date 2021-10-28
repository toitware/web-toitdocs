import styled from "@emotion/styled";
import "codemirror/lib/codemirror.css";
import React from "react";
import { UnControlled as CodeMirror } from "react-codemirror2";
import "../../assets/codemirror/codemirror.css";
import "../../assets/codemirror/toit";

const Wrapper = styled.div`
  max-height: 400px;
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
