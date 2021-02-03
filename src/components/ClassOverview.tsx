// Copyright (C) 2020 Toitware ApS. All rights reserved.

import {
  AppBar,
  createStyles,
  Divider,
  StyleRules,
  Tab,
  Tabs,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import React, { Component } from "react";
import { Class } from "../model/model";
import TablePanel from "./TablePanel";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    root: {
      minWidth: 650,
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(8),
    },
    title: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(1),
    },
    hiddenTab: {
      display: "none",
    },
    tabs: {
      backgroundColor: theme.palette.background.paper,
    },
  });

interface ClassOverviewProps extends WithStyles<typeof styles> {
  klass: Class;
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
        this.props.klass.constructors.length > 0
          ? 0
          : this.props.klass.statics.length > 0
          ? 1
          : this.props.klass.methods.length > 0
          ? 2
          : 3,
    };
  }
  render(): JSX.Element {
    const classes = this.props.classes;
    const klass = this.props.klass;
    return (
      <div className={classes.root}>
        <div className={classes.title}>
          <Typography variant="h4">Class summary</Typography>
        </div>
        <Divider />
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
              className={klass.constructors.length > 0 ? "" : classes.hiddenTab}
            />
            <Tab
              label="Statics"
              {...a11yProps(1)}
              onClick={(): void => this.setState({ tab: 1 })}
              className={klass.statics.length > 0 ? "" : classes.hiddenTab}
            />
            <Tab
              label="Methods"
              {...a11yProps(2)}
              onClick={(): void => this.setState({ tab: 2 })}
              className={klass.methods.length > 0 ? "" : classes.hiddenTab}
            />
            <Tab
              label="Fields"
              {...a11yProps(3)}
              onClick={(): void => this.setState({ tab: 3 })}
              className={klass.fields.length > 0 ? "" : classes.hiddenTab}
            />
          </Tabs>
        </AppBar>
        <TablePanel
          tab={0}
          active={this.state.tab}
          tabData={klass.constructors}
          hideReturnTypes={true}
          ariaLabel="Constructors"
        />
        <TablePanel
          tab={1}
          active={this.state.tab}
          tabData={klass.statics}
          ariaLabel="Statics"
        />
        <TablePanel
          tab={2}
          active={this.state.tab}
          tabData={klass.methods}
          ariaLabel="Methods"
        />
        <TablePanel
          tab={3}
          active={this.state.tab}
          tabFieldData={klass.fields}
          ariaLabel="Fields"
        />
      </div>
    );
  }
}

export default withStyles(styles)(ClassOverviewView);
