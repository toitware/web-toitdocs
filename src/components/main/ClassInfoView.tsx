// Copyright (C) 2020 Toitware ApS. All rights reserved.

import Typography from "@material-ui/core/Typography";
import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { classFrom, classUrlFromRef } from "../../misc/util";
import {
  CLASS_KIND_CLASS,
  CLASS_KIND_INTERFACE,
  CLASS_KIND_MIXIN,
  Libraries,
} from "../../model/model";
import Fields from "../doc/Fields";
import Functions from "../doc/Functions";
import Toitdocs from "../doc/Toitdocs";
import { TypeReference } from "../doc/Type";
import ClassOverview from "./ClassOverview";

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
    analytics.page("toitdocs");
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
    let kind = "";
    if (classInfo.kind === CLASS_KIND_CLASS) {
      kind = "Class";
    } else if (classInfo.kind === CLASS_KIND_INTERFACE) {
      kind = "Interface";
    } else if (classInfo.kind === CLASS_KIND_MIXIN) {
      kind = "Mixin";
    } else {
      throw new Error("Unknown class kind: " + classInfo.kind);
    }

    return (
      <>
        <Typography variant="h2" component="h2">
          {kind} {classInfo.name}
        </Typography>
        {(classInfo.extends ||
          classInfo.interfaces.length !== 0 ||
          classInfo.mixins.length !== 0) && (
          <div>
            {classInfo.extends && (
              <>
                extends <TypeReference reference={classInfo.extends} />
              </>
            )}
            {classInfo.mixins.length !== 0 && " with "}
            {classInfo.mixins.map((ref) => {
              const key = classUrlFromRef(ref);
              return (
                <span key={key}>
                  <TypeReference reference={ref} />{" "}
                </span>
              );
            })}
            {classInfo.interfaces.length !== 0 && " implements "}
            {classInfo.interfaces.map((ref) => {
              const key = classUrlFromRef(ref);
              return (
                <span key={key}>
                  <TypeReference reference={ref} />{" "}
                </span>
              );
            })}
          </div>
        )}
        {classInfo.toitdoc && <Toitdocs value={classInfo.toitdoc} />}
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
