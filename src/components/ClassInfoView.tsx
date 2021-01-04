// Copyright (C) 2020 Toitware ApS. All rights reserved.

import { Grid, Hidden } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { ToitLibraries, ToitReference } from "../model/toitsdk";
import { getClass } from "../sdk";
import ClassContentList from "./ClassContentList";
import Fields from "./Fields";
import Methods from "./Methods";
import { Reference } from "./Util";

function Extends(props: { reference: ToitReference }): JSX.Element {
  return (
    <div>
      extends <Reference reference={props.reference} />
    </div>
  );
}

export interface ClassInfoParams {
  libraryName: string;
  moduleName: string;
  className: string;
}

export interface ClassInfoProps extends RouteComponentProps<ClassInfoParams> {
  libraries: ToitLibraries;
}

export default class ClassInfoView extends Component<ClassInfoProps> {
  componentDidMount(): void {
    const hashId = this.props.location.hash.substring(1);
    const element = document.getElementById(hashId);
    element?.scrollIntoView(true);
  }

  render(): React.ReactNode {
    const classInfo = getClass(
      this.props.libraries,
      this.props.match.params.libraryName,
      this.props.match.params.moduleName,
      this.props.match.params.className
    );

    if (!classInfo) {
      return this.notFound(this.props.match.params.className);
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

  notFound(name: string): JSX.Element {
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
