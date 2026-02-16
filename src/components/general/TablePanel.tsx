// Copyright (C) 2024 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Theme,
} from "@mui/material";
import React from "react";
import { HashLink } from "react-router-hash-link";
import { makeStyles } from "tss-react/mui";
import { getFunctionId } from "../../misc/util";
import { Field, Function, Method } from "../../model/model";
import { getDescription } from "../doc/Functions";
import Toitdocs from "../doc/Toitdocs";
import { TypeView } from "../doc/Type";

const useStyles = makeStyles()((theme: Theme) => ({
  methodsTable: {
    marginTop: theme.spacing(1),
  },
}));

interface TablePanelGenProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TablePanelGen(props: TablePanelGenProps): JSX.Element {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <span>{children}</span>
        </Box>
      )}
    </div>
  );
}

interface TablePanelProps {
  tab: number;
  active: number;
  tabData?: (Function | Method)[];
  tabFieldData?: Field[];
  hideReturnTypes?: boolean;
  ariaLabel: string;
}

export default function TablePanel(props: TablePanelProps): JSX.Element {
  const { classes } = useStyles();
  if (props.tabFieldData)
    return (
      <TablePanelGen value={props.active} index={props.tab}>
        <TableContainer>
          <Table
            size="small"
            aria-label={props.ariaLabel}
            className={classes.methodsTable}
          >
            <TableBody>
              {props.tabFieldData.length > 0 &&
                props.tabFieldData.map((field, index) => (
                  <TableRow key={field.name + index}>
                    <TableCell component="th" scope="row">
                      <HashLink to={{ hash: field.name }}>
                        {field.name}
                      </HashLink>{" "}
                      / <TypeView type={field.type} />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Toitdocs value={field.toitdoc} headerOnly={true} />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TablePanelGen>
    );
  else if (props.tabData)
    return (
      <TablePanelGen value={props.active} index={props.tab}>
        <TableContainer>
          <Table
            size="small"
            aria-label={props.ariaLabel}
            className={classes.methodsTable}
          >
            <TableBody>
              {props.tabData.length > 0 &&
                props.tabData.map((method, index) => (
                  <TableRow key={method.name + index}>
                    <TableCell component="th" scope="row">
                      <HashLink
                        to={{
                          hash: getFunctionId(method.name, method.shape),
                        }}
                      >
                        {method.name}
                      </HashLink>{" "}
                      {getDescription(
                        method.parameters,
                        method.returnType,
                        props.hideReturnTypes
                      )}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Toitdocs value={method.toitdoc} headerOnly={true} />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TablePanelGen>
    );
  else return <></>;
}
