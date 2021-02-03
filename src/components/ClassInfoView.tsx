// Copyright (C) 2020 Toitware ApS. All rights reserved.

import Typography from "@material-ui/core/Typography";
import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { classFrom } from "../misc/util";
import { Modules } from "../model/model";
import ClassOverview from "./ClassOverview";
import Fields from "./Fields";
import Functions from "./Functions";
import { TypeReference } from "./Util";

export interface ClassInfoParams {
  moduleName: string;
  className: string;
}

export interface ClassInfoProps extends RouteComponentProps<ClassInfoParams> {
  modules: Modules;
}

export default class ClassInfoView extends Component<ClassInfoProps> {
  componentDidMount(): void {
    const hashId = this.props.location.hash.substring(1);
    const element = document.getElementById(hashId);
    element?.scrollIntoView(true);
  }

  render(): React.ReactNode {
    const classInfo = classFrom(
      this.props.match.params.moduleName,
      this.props.match.params.className,
      this.props.modules
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
