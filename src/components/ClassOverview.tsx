// Copyright (C) 2020 Toitware ApS. All rights reserved.

import {
  AppBar,
  createStyles,
  Grid,
  StyleRules,
  Tab,
  Tabs,
  Theme,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import React, { Component } from "react";
import { ToitClass } from "../generator/sdk";
import TablePanel from "./TablePanel";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    table: {
      minWidth: 650,
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    hiddenTab: {
      display: "none",
    },
    tabs: {
      backgroundColor: theme.palette.background.paper,
    },
  });

interface ClassOverviewProps extends WithStyles<typeof styles> {
  libraries: ToitClass;
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
      tab:
        this.props.libraries.structure.constructors.length > 0
          ? 0
          : this.props.libraries.structure.factories.length > 0
          ? 0
          : this.props.libraries.structure.statics.length > 0
          ? 1
          : this.props.libraries.structure.methods.length > 0
          ? 2
          : 3,
    };
  }
  render(): JSX.Element {
    const classes = this.props.classes;
    return (
      <Grid container className={classes.table}>
        <AppBar position="static" elevation={0}>
          <Tabs
            value={this.state.tab}
            aria-label="Class overview"
            className={classes.tabs}
          >
            <Tab
              label="Constructors"
              {...a11yProps(0)}
              onClick={(): void => this.setState({ tab: 0 })}
              className={
                this.props.libraries.structure.constructors.concat(
                  this.props.libraries.structure.factories
                ).length > 0
                  ? ""
                  : classes.hiddenTab
              }
            />
            <Tab
              label="Statics"
              {...a11yProps(1)}
              onClick={(): void => this.setState({ tab: 1 })}
              className={
                this.props.libraries.structure.statics.length > 0
                  ? ""
                  : classes.hiddenTab
              }
            />
            <Tab
              label="Methods"
              {...a11yProps(2)}
              onClick={(): void => this.setState({ tab: 2 })}
              className={
                this.props.libraries.structure.methods.length > 0
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
        <TablePanel
          tab={0}
          active={this.state.tab}
          tabData={this.props.libraries.structure.constructors.concat(
            this.props.libraries.structure.factories
          )}
          hideReturnTypes={true}
          ariaLabel="Constructors"
        />
        <TablePanel
          tab={1}
          active={this.state.tab}
          tabData={this.props.libraries.structure.statics}
          hideReturnTypes={false}
          ariaLabel="Statics"
        />
        <TablePanel
          tab={2}
          active={this.state.tab}
          tabData={this.props.libraries.structure.methods}
          hideReturnTypes={false}
          ariaLabel="Methods"
        />
        <TablePanel
          tab={3}
          active={this.state.tab}
          tabFieldData={this.props.libraries.structure.fields}
          hideReturnTypes={false}
          ariaLabel="Fields"
        />
      </Grid>
    );
  }
}

export default withStyles(styles)(ClassOverviewView);
