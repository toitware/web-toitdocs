import {
  Box,
  createStyles,
  StyleRules,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import React, { Component } from "react";
import { HashLink } from "react-router-hash-link";
import { ToitField, ToitFunction } from "../generator/sdk";
import { getDescription, getId } from "./Functions";
import { Type } from "./Util";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    methodsTable: {
      marginTop: theme.spacing(1),
    },
  });

interface TablePanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TablePandelGen(props: TablePanelProps): JSX.Element {
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

interface TableProps extends WithStyles<typeof styles> {
  tab: number;
  active: number;
  tabData?: ToitFunction[];
  tabFieldData?: ToitField[];
  hideReturnTypes: boolean;
  ariaLabel: string;
}

class TablePanel extends Component<TableProps> {
  render(): JSX.Element {
    const classes = this.props.classes;
    if (this.props.tabFieldData)
      return (
        <TablePandelGen value={this.props.active} index={this.props.tab}>
          <TableContainer>
            <Table
              size="small"
              aria-label={this.props.ariaLabel}
              className={classes.methodsTable}
            >
              <TableBody>
                {this.props.tabFieldData.length > 0 &&
                  this.props.tabFieldData.map((method) => (
                    <TableRow key={method.name}>
                      <TableCell component="th" scope="row">
                        <HashLink to={{ hash: method.name }}>
                          {method.name}
                        </HashLink>{" "}
                        <Type type={method.type} />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TablePandelGen>
      );
    else if (this.props.tabData)
      return (
        <TablePandelGen value={this.props.active} index={this.props.tab}>
          <TableContainer>
            <Table
              size="small"
              aria-label={this.props.ariaLabel}
              className={classes.methodsTable}
            >
              <TableBody>
                {this.props.tabData.length > 0 &&
                  this.props.tabData.map((method) => (
                    <TableRow key={method.name}>
                      <TableCell component="th" scope="row">
                        <HashLink
                          to={{ hash: getId(method.name, method.parameters) }}
                        >
                          {method.name}
                        </HashLink>{" "}
                        {getDescription(method, this.props.hideReturnTypes)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TablePandelGen>
      );
    else return <></>;
  }
}

export default withStyles(styles)(TablePanel);
