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
import { Field, Function, Method } from "../../model/model";
import { getDescription, getId } from "../sdk/Functions";
import { TypeView } from "../sdk/Type";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    methodsTable: {
      marginTop: theme.spacing(1),
    },
  });

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

interface TablePanelProps extends WithStyles<typeof styles> {
  tab: number;
  active: number;
  tabData?: (Function | Method)[];
  tabFieldData?: Field[];
  hideReturnTypes?: boolean;
  ariaLabel: string;
}

class TablePanel extends Component<TablePanelProps> {
  render(): JSX.Element {
    const classes = this.props.classes;
    if (this.props.tabFieldData)
      return (
        <TablePanelGen value={this.props.active} index={this.props.tab}>
          <TableContainer>
            <Table
              size="small"
              aria-label={this.props.ariaLabel}
              className={classes.methodsTable}
            >
              <TableBody>
                {this.props.tabFieldData.length > 0 &&
                  this.props.tabFieldData.map((field, index) => (
                    <TableRow key={field.name + index}>
                      <TableCell component="th" scope="row">
                        <HashLink to={{ hash: field.name }}>
                          {field.name}
                        </HashLink>{" "}
                        <TypeView type={field.type} />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TablePanelGen>
      );
    else if (this.props.tabData)
      return (
        <TablePanelGen value={this.props.active} index={this.props.tab}>
          <TableContainer>
            <Table
              size="small"
              aria-label={this.props.ariaLabel}
              className={classes.methodsTable}
            >
              <TableBody>
                {this.props.tabData.length > 0 &&
                  this.props.tabData.map((method, index) => (
                    <TableRow key={method.name + index}>
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
        </TablePanelGen>
      );
    else return <></>;
  }
}

export default withStyles(styles)(TablePanel);
