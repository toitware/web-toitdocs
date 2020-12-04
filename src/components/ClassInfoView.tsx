// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import ClassContentList from "./class_content_list";
import Methods from "./Methods";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { Hidden } from "@material-ui/core";
import { getLibrary } from "../sdk";
import { Reference } from "./util";
import { ToitLibraries, ToitReference } from "../model/toitsdk";
import { match } from "react-router-dom";
import Fields from "./Fields";

function Extends(props: { reference: ToitReference }): JSX.Element {
  return (
    <div>
      extends <Reference reference={props.reference} />
    </div>
  );
}

interface ClassInfoParams {
  libName: string;
  moduleName: string;
  className: string;
}

export interface ClassInfoProps {
  libraries: ToitLibraries;
  match: match<ClassInfoParams>;
}

export default class ClassInfoView extends Component<ClassInfoProps> {
  render(): React.ReactNode {
    const {
      params: { libName, moduleName, className },
    } = this.props.match;

    const library = getLibrary(this.props.libraries, libName);
    const module = library && library.modules[moduleName];

    if (!module) {
      return this.notFound(className);
    }

    let classInfo = module.classes.find(({ name }) => name === className);
    if (!classInfo) {
      classInfo = module.export_classes.find(({ name }) => name === className);
    }

    if (!classInfo) {
      return this.notFound(className);
    }

    return (
      <Grid container>
        <Grid item xs={12} sm={9}>
          <Box pt={2} pb={2}>
            <Typography variant="h2" component="h2">
              Class: {classInfo.name}
            </Typography>
            {classInfo.extends && <Extends reference={classInfo.extends} />}
          </Box>
          {classInfo.structure.constructors.length > 0 && (
            <>
              <Typography variant="h3" component="h3">
                Constructors
              </Typography>
              <Methods functions={classInfo.structure.constructors} />
            </>
          )}
          {classInfo.structure.factories.length > 0 && (
            <>
              <Typography variant="h3" component="h3">
                Factories
              </Typography>
              <Methods functions={classInfo.structure.factories} />
            </>
          )}
          {classInfo.structure.statics.length > 0 && (
            <>
              <Typography variant="h3" component="h3">
                Statics
              </Typography>
              <Methods functions={classInfo.structure.statics} />
            </>
          )}
          {classInfo.structure.methods.length > 0 && (
            <>
              <Typography variant="h3" component="h3">
                Methods
              </Typography>
              <Methods functions={classInfo.structure.methods} />
            </>
          )}
          {classInfo.structure.fields.length > 0 && (
            <>
              <Typography variant="h3" component="h3">
                Fields
              </Typography>
              <Fields fields={classInfo.structure.fields} />
            </>
          )}
        </Grid>
        <Hidden xsDown>
          <Grid item sm={3}>
            <ClassContentList class={classInfo} />
          </Grid>
        </Hidden>
      </Grid>
    );
  }

  notFound(name: string): React.ReactNode {
    return (
      <Grid container>
        <Grid item xs={12} sm={9}>
          <Typography variant="h2" component="h2">
            {"Class: " + name + " not found!"}
          </Typography>
        </Grid>
      </Grid>
    );
  }
}
