// Copyright (C) 2020 Toitware ApS. All rights reserved.

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { ToitLibraries, ToitStructure } from "../model/toitsdk";
import { getClass } from "../sdk";
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

function removePrivate(props: ToitStructure): ToitStructure {
  const noPrivProps = {
    statics: props.statics.filter((elem) => elem.is_private === false),
    constructors: props.constructors.filter(
      (elem) => elem.is_private === false
    ),
    factories: props.factories.filter((elem) => elem.is_private === false),
    fields: props.fields.filter((elem) => elem.is_private === false),
    methods: props.methods.filter((elem) => elem.is_private === false),
  };

  return noPrivProps;
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
    const classStructure = removePrivate(classInfo.structure);
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
        {classStructure.constructors.concat(classStructure.factories).length >
          0 && (
          <>
            <Functions
              functions={classStructure.constructors.concat(
                classStructure.factories
              )}
              title="Constructors"
              hideReturnTypes
            />
          </>
        )}
        {classStructure.statics.length > 0 && (
          <>
            <Functions functions={classStructure.statics} title="Statics" />
          </>
        )}
        {classStructure.methods.length > 0 && (
          <Functions functions={classStructure.methods} title="Methods" />
        )}
        {classStructure.fields.length > 0 && (
          <>
            <Fields fields={classStructure.fields} />
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
