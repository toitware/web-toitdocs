// Copyright (C) 2020 Toitware ApS. All rights reserved.

import {
  AppBar,
  Box,
  createStyles,
  Grid,
  StyleRules,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tabs,
  Theme,
  Typography,
  withStyles,
  WithStyles
} from "@material-ui/core";
import React, { Component } from "react";
import { HashLink } from "react-router-hash-link";
import { ToitClass } from "../model/toitsdk";
import { getId } from "./Methods";
import { Parameters } from "./Parameters";
import { Type } from "./Util";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    table: {
      minWidth: 650,
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    tableContainer: {
      padding: 0,
    },
    hiddenTab: {
      display: "none",
    },
    methodsTable: {
      marginTop: theme.spacing(1),
    },
  });

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface ClassOverviewProps extends WithStyles<typeof styles> {
  libraries: ToitClass;
}

function TabPanel(props: TabPanelProps): JSX.Element {
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
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number): { id: string; "aria-controls": string } {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

interface TabProps {
  tab: number;
}

class ClassOverviewView extends Component<ClassOverviewProps, TabProps> {
  constructor(props: ClassOverviewProps) {
    super(props);
    this.state = {
      tab: 0,
    };
  }
  render(): JSX.Element {
    const classes = this.props.classes;
    return (
      <Grid container className={classes.table}>
        <div>
          <AppBar position="static">
            <Tabs value={this.state.tab} aria-label="Class overview">
              <Tab
                label="Methods"
                {...a11yProps(0)}
                onClick={(): void => this.setState({ tab: 0 })}
                className={
                  this.props.libraries.structure.methods.length > 0
                    ? ""
                    : classes.hiddenTab
                }
              />
              <Tab
                label="Constructors"
                {...a11yProps(1)}
                onClick={(): void => this.setState({ tab: 1 })}
                className={
                  this.props.libraries.structure.constructors.length > 0
                    ? ""
                    : classes.hiddenTab
                }
              />
              <Tab
                label="Statics"
                {...a11yProps(2)}
                onClick={(): void => this.setState({ tab: 2 })}
                className={
                  this.props.libraries.structure.statics.length > 0
                    ? ""
                    : classes.hiddenTab
                }
              />
              <Tab
                label="Fields"
                {...a11yProps(3)}
                onClick={(): void => this.setState({ tab: 3 })}
                className={
                  this.props.libraries.structure.fields.length > 0
                    ? ""
                    : classes.hiddenTab
                }
              />
            </Tabs>
          </AppBar>
          <TabPanel value={this.state.tab} index={0}>
            <TableContainer>
              <Table
                size="small"
                aria-label="Class overview table"
                className={classes.methodsTable}
              >
                <TableBody>
                  {this.props.libraries.structure.methods.length > 0 &&
                    this.props.libraries.structure.methods.map((method) => (
                      <TableRow key={method.name}>
                        <TableCell component="th" scope="row">
                          <HashLink to={{ hash: getId(method) }}>
                            {method.name}
                          </HashLink>
                          <Parameters parameters={method.parameters} />
                          <span>{" -> "}</span>
                          <Type type={method.return_type}></Type>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value={this.state.tab} index={1}>
            <TableContainer>
              <Table
                size="small"
                aria-label="Class overview table"
                className={classes.methodsTable}
              >
                <TableBody>
                  {this.props.libraries.structure.constructors.length > 0 &&
                    this.props.libraries.structure.constructors.map(
                      (method) => (
                        <TableRow key={method.name}>
                          <TableCell component="th" scope="row">
                            <HashLink to={{ hash: getId(method) }}>
                              {method.name}
                            </HashLink>
                            <Parameters
                              parameters={method.parameters}
                            ></Parameters>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value={this.state.tab} index={2}>
            <TableContainer>
              <Table
                size="small"
                aria-label="Class overview table"
                className={classes.methodsTable}
              >
                <TableBody>
                  {this.props.libraries.structure.statics.length > 0 &&
                    this.props.libraries.structure.statics.map((method) => (
                      <TableRow key={method.name}>
                        <TableCell component="th" scope="row">
                          <HashLink to={{ hash: getId(method) }}>
                            {method.name}
                          </HashLink>
                          <Parameters parameters={method.parameters} />
                          <span>{" -> "}</span>
                          <Type type={method.return_type}></Type>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={this.state.tab} index={3}>
            <TableContainer>
              <Table
                size="small"
                aria-label="Class overview table"
                className={classes.methodsTable}
              >
                <TableBody>
                  {this.props.libraries.structure.fields.length > 0 &&
                    this.props.libraries.structure.fields.map((method) => (
                      <TableRow key={method.name}>
                        <TableCell component="th" scope="row">
                          <HashLink to={{ hash: method.name }}>
                            {method.name}
                          </HashLink>
                          <Type type={method.type} />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </div>
      </Grid>
    );
  }
}

export default withStyles(styles)(ClassOverviewView);
