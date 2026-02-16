// Copyright (C) 2020 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import {
    Divider,
    Tab,
    Tabs,
    Theme,
    Typography,
} from "@mui/material";
import React from "react";
import { makeStyles } from "tss-react/mui";
import {
    Class,
    CLASS_KIND_CLASS,
    CLASS_KIND_INTERFACE,
    CLASS_KIND_MIXIN,
} from "../../model/model";
import TablePanel from "../general/TablePanel";

const useStyles = makeStyles()((theme: Theme) => ({
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
}));

interface ClassOverviewProps {
  klass: Class;
}

function a11yProps(index: number): { id: string; "aria-controls": string } {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

export default function ClassOverviewView(props: ClassOverviewProps): JSX.Element {
  const { classes } = useStyles();
  const klass = props.klass;
  const [tab, setTab] = React.useState(
    klass.constructors.length > 0
      ? 0
      : klass.statics.length > 0
      ? 1
      : klass.methods.length > 0
      ? 2
      : 3
  );

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
        value={tab}
        aria-label="Class overview"
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab
          label="Constructors"
          {...a11yProps(0)}
          onClick={(): void => setTab(0)}
          className={klass.constructors.length > 0 ? "" : classes.hiddenTab}
        />
        <Tab
          label="Statics"
          {...a11yProps(1)}
          onClick={(): void => setTab(1)}
          className={klass.statics.length > 0 ? "" : classes.hiddenTab}
        />
        <Tab
          label="Methods"
          {...a11yProps(2)}
          onClick={(): void => setTab(2)}
          className={klass.methods.length > 0 ? "" : classes.hiddenTab}
        />
        <Tab
          label="Fields"
          {...a11yProps(3)}
          onClick={(): void => setTab(3)}
          className={klass.fields.length > 0 ? "" : classes.hiddenTab}
        />
      </Tabs>
      <TablePanel
        tab={0}
        active={tab}
        tabData={klass.constructors}
        hideReturnTypes={true}
        ariaLabel="Constructors"
      />
      <TablePanel
        tab={1}
        active={tab}
        tabData={klass.statics}
        ariaLabel="Statics"
      />
      <TablePanel
        tab={2}
        active={tab}
        tabData={klass.methods}
        ariaLabel="Methods"
      />
      <TablePanel
        tab={3}
        active={tab}
        tabFieldData={klass.fields}
        ariaLabel="Fields"
      />
    </div>
  );
}
