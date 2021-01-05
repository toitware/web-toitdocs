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
  TableHead,
  TableRow,
  Tabs,
  Theme,
  Typography,
  withStyles,
  WithStyles
} from "@material-ui/core";
import React, { Component } from "react";
import { ToitClass } from "../model/toitsdk";

//Can first be used, when we have implemented the redux props correctly
const styles = (theme: Theme): StyleRules =>
  createStyles({
    table: {
      minWidth: 650,
    },
    hiddenTab:{
      display: "none",
    }
  });

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface ClassOverviewParams {
  libraryName: string;
  moduleName: string;
  className: string;
}

export interface ClassOverviewProps extends WithStyles<typeof styles> {
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
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

interface TabProps{
  tab: number;
}

class ClassOverviewView extends Component<ClassOverviewProps, TabProps> {
  constructor(props: any) {
    super(props);
    console.log(this.props.libraries);
    this.state = {
      tab: 0,
    };

  }
  render(): JSX.Element {
    return (
      <Grid container>
        <div>
          <AppBar position="static">
            <Tabs value={this.state.tab} aria-label="Class overview">
                <Tab
                  label="Statics"
                  {...a11yProps(0)}
                  onClick={(): void => this.setState({ tab: 0 })}
                />
                <Tab
                  label="Constructors"
                  {...a11yProps(1)}
                  onClick={(): void => this.setState({ tab: 1 })}
                />
                <Tab
                  label="Methods"
                  {...a11yProps(2)}
                  onClick={(): void => this.setState({ tab: 2 })}
                />
                <Tab
                  label="Fields"
                  {...a11yProps(3)}
                  onClick={(): void => this.setState({ tab: 3 })}
                />
            </Tabs>
          </AppBar>
          <TabPanel value={this.state.tab} index={0}>
            <TableContainer>
              <Table size="small" aria-label="Class overview table">
                <TableHead>
                  <TableRow>
                    <TableCell>Method</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.props.libraries.structure.statics.length > 0 && this.props.libraries.structure.statics.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row">
                        {row.name} 
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value={this.state.tab} index={1}>
            Constructors
          </TabPanel>
          <TabPanel value={this.state.tab} index={2}>
          <TableContainer>
              <Table size="small" aria-label="Class overview table">
                <TableHead>
                  <TableRow>
                    <TableCell>Method</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.props.libraries.structure.methods.length > 0 && this.props.libraries.structure.methods.map((method) => (
                    <TableRow key={method.name}>
                    <TableCell component="th" scope="row">
                      {method.name}
                    </TableCell>
                  </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value={this.state.tab} index={3}>
            Fields
          </TabPanel>
        </div>
      </Grid>
    );
  }
}

export default withStyles(styles)(ClassOverviewView);
