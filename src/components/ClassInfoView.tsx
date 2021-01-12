// Copyright (C) 2020 Toitware ApS. All rights reserved.

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { ToitLibraries } from "../generator/sdk";
import { getClass } from "../redux/sdk";
import Fields from "./Fields";
import Functions from "./Functions";
import Toitdocs from "./ToitdocInfo";
import { Reference } from "./Util";

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
      <>
        <Box pt={2} pb={2}>
          <Typography variant="h2" component="h2">
            Class {classInfo.name}
          </Typography>
          {classInfo.extends && (
            <div>
              extends <Reference reference={classInfo.extends} />
            </div>
          )}
        </Box>
        <Box pb={3}>
          <Toitdocs value={classInfo.toitdoc} />
        </Box>
        {classInfo.structure.constructors.concat(classInfo.structure.factories)
          .length > 0 && (
          <>
            <Functions
              functions={classInfo.structure.constructors.concat(
                classInfo.structure.factories
              )}
              title="Constructors"
              hideReturnTypes
            />
          </>
        )}
        {classInfo.structure.statics.length > 0 && (
          <>
            <Functions
              functions={classInfo.structure.statics}
              title="Statics"
            />
          </>
        )}
        {classInfo.structure.methods.length > 0 && (
          <Functions functions={classInfo.structure.methods} title="Methods" />
        )}
        {classInfo.structure.fields.length > 0 && (
          <>
            <Fields fields={classInfo.structure.fields} />
          </>
        )}
      </>
    );
  }

  notFound(name: string): JSX.Element {
    return (
      <Typography variant="h2" component="h2">
        {"Class: " + name + " not found!"}
      </Typography>
    );
  }
}
