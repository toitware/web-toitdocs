// Copyright (C) 2020 Toitware ApS. All rights reserved.

import Typography from "@material-ui/core/Typography";
import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { classFrom } from "../../misc/util";
import { Libraries } from "../../model/model";
import Fields from "../sdk/Fields";
import Functions from "../sdk/Functions";
import { TypeReference } from "../sdk/Type";
import ClassOverview from "./ClassOverview";
import Toitdocs from "../sdk/Toitdocs";


export interface ClassInfoParams {
  libraryName: string;
  className: string;
}

export interface ClassInfoProps extends RouteComponentProps<ClassInfoParams> {
  libraries: Libraries;
}

export default class ClassInfoView extends Component<ClassInfoProps> {
  componentDidMount(): void {
    const hashId = this.props.location.hash.substring(1);
    const element = document.getElementById(hashId);
    element?.scrollIntoView(true);
  }

  render(): React.ReactNode {
    const classInfo = classFrom(
      this.props.match.params.libraryName,
      this.props.match.params.className,
      this.props.libraries
    );
    if (!classInfo) {
      return this.notFound(this.props.match.params.className);
    }

    return (
      <>
        <Typography variant="h2" component="h2">
          Class {classInfo.name}
        </Typography>
        {classInfo.extends && (
          <div>
            extends <TypeReference reference={classInfo.extends} />
          </div>
        )}
        {classInfo.toitdoc && (
          // TODO(florian): the div should have a class.
          <div>
            <Toitdocs value={classInfo.toitdoc} />
          </div>
        )}
        <ClassOverview klass={classInfo} />
        {classInfo.constructors.length > 0 && (
          <Functions
            functions={classInfo.constructors}
            title="Constructors"
            hideReturnTypes
          />
        )}
        {classInfo.statics.length > 0 && (
          <Functions functions={classInfo.statics} title="Statics" />
        )}
        {classInfo.methods.length > 0 && (
          <Functions functions={classInfo.methods} title="Methods" />
        )}
        {classInfo.fields.length > 0 && <Fields fields={classInfo.fields} />}
      </>
    );
  }

  notFound(className: string): JSX.Element {
    return (
      <Typography variant="h4">
        {"Error: Class " + className + " not found"}
      </Typography>
    );
  }
}
