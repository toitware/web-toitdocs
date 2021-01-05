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
  WithStyles,
} from "@material-ui/core";
import React, { Component } from "react";
import { ToitClass } from "../model/toitsdk";

//Can first be used, when we have implemented the redux props correctly
const styles = (theme: Theme): StyleRules =>
  createStyles({
    table: {
      minWidth: 650,
    },
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

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
): any {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

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

class ClassOverviewView extends Component<ClassOverviewProps, { tab: number }> {
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
              {this.props.libraries.structure.statics.length > 0 && (
                <Tab
                  label="Statics"
                  {...a11yProps(0)}
                  onClick={(): void => this.setState({ tab: 0 })}
                />
              )}
              {this.props.libraries.structure.constructors.length > 0 && (
                <Tab
                  label="Constructors"
                  {...a11yProps(1)}
                  onClick={(): void => this.setState({ tab: 1 })}
                />
              )}
              {this.props.libraries.structure.factories.length > 0 && (
                <Tab
                  label="Factories"
                  {...a11yProps(2)}
                  onClick={(): void => this.setState({ tab: 2 })}
                />
              )}
              {this.props.libraries.structure.methods.length > 0 && (
                <Tab
                  label="Methods"
                  {...a11yProps(3)}
                  onClick={(): void => this.setState({ tab: 3 })}
                />
              )}

              {this.props.libraries.structure.fields.length > 0 && (
                <Tab
                  label="Fields"
                  {...a11yProps(4)}
                  onClick={(): void => this.setState({ tab: 4 })}
                />
              )}
            </Tabs>
          </AppBar>
          <TabPanel value={this.state.tab} index={0}>
            <TableContainer>
              <Table size="small" aria-label="Class overview table">
                <TableHead>
                  <TableRow>
                    <TableCell>Method and Description</TableCell>
                    <TableCell align="right">Modifier and Type</TableCell>
                    <TableCell align="right">Something else</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.calories}</TableCell>
                      <TableCell align="right">{row.fat}</TableCell>
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
            Factories
          </TabPanel>
          <TabPanel value={this.state.tab} index={3}>
            Methods
          </TabPanel>
          <TabPanel value={this.state.tab} index={4}>
            Fields
          </TabPanel>
        </div>
      </Grid>
    );
  }
}

export default withStyles(styles)(ClassOverviewView);
