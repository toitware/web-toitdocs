// Copyright (C) 2026 Toit contributors.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function MissingPage(props: {
  privateClass?: string;
}): JSX.Element {
  return (
    <>
      <Typography variant="h2" component="h2">
        {props.privateClass
          ? `Private class ${props.privateClass}`
          : "Documentation unavailable"}
      </Typography>
      <Typography>
        {props.privateClass
          ? "Documentation for private classes is not included in this build."
          : "The requested documentation is not included in this build. It may have moved or been removed."}
      </Typography>
      <Link to="/">Browse the documentation</Link>
    </>
  );
}
