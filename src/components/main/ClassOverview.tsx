// Copyright (C) 2020 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import {
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
import {
  Class,
  CLASS_KIND_CLASS,
  CLASS_KIND_INTERFACE,
  CLASS_KIND_MIXIN,
} from "../../model/model";
import TablePanel from "../general/TablePanel";

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
    let kind = "";
    if (klass.kind === CLASS_KIND_CLASS) {
      kind = "Class";
    } else if (klass.kind === CLASS_KIND_INTERFACE) {
      kind = "Interface";
    } else if (klass.kind === CLASS_KIND_MIXIN) {
      kind = "Mixin";
    } else {
      throw new Error("Unknown class kind: " + klass.kind);
    }
    return (
      <div className={classes.root}>
        <div className={classes.title}>
          <Typography variant="h4">{kind} summary</Typography>
        </div>
        <Divider />
        <Tabs
          value={this.state.tab}
          aria-label="Class overview"
          textColor="primary"
          indicatorColor="primary"
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
