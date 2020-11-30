// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React, { Component } from "react";
import { connect } from "react-redux";
import { createStyles, WithStyles, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ClassContentList from "./class_content_list";
import Toitdocs from "./toitdoc_info";
import { Methods } from "./methods";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { Hidden } from "@material-ui/core";
import { getLibrary, RootState } from "../sdk";
import { Reference, Type } from "./util";
import {
  ToitField,
  ToitFunction,
  ToitLibraries,
  ToitReference,
} from "../model/toitsdk";
import { match } from "react-router-dom";

function Extends(props: { reference: ToitReference }): JSX.Element {
  return (
    <div>
      extends <Reference reference={props.reference} />
    </div>
  );
}

function Constructors(props: {
  constructors: ToitFunction[];
  libName: string;
  moduleName: string;
  className: string;
}): JSX.Element {
  return (
    <div>
      <Typography variant="h3" component="h3">
        Constructors
      </Typography>
      <Methods
        functions={props.constructors}
        libName={props.libName}
        moduleName={props.moduleName}
        className={props.className}
        functionType="Constructors"
      />
    </div>
  );
}

function Statics(props: {
  statics: ToitFunction[];
  libName: string;
  moduleName: string;
  className: string;
}): JSX.Element {
  return (
    <div>
      <Typography variant="h3" component="h3">
        Statics
      </Typography>
      <Methods
        functions={props.statics}
        libName={props.libName}
        moduleName={props.moduleName}
        className={props.className}
        functionType="Statics"
      />
    </div>
  );
}

function Factories(props: {
  factories: ToitFunction[];
  libName: string;
  moduleName: string;
  className: string;
}): JSX.Element {
  return (
    <div>
      <Typography variant="h3" component="h3">
        Factories
      </Typography>
      <Methods
        functions={props.factories}
        libName={props.libName}
        moduleName={props.moduleName}
        className={props.className}
        functionType="Factories"
      />
    </div>
  );
}

function ClassMethods(props: {
  classMethods: ToitFunction[];
  libName: string;
  moduleName: string;
  className: string;
}): JSX.Element {
  return (
    <div>
      <Typography variant="h3" component="h3">
        Methods
      </Typography>
      <Methods
        functions={props.classMethods}
        libName={props.libName}
        moduleName={props.moduleName}
        className={props.className}
        functionType="Methods"
      />
    </div>
  );
}

function Fields(props: { fields: ToitField[] }): JSX.Element {
  return (
    <div>
      <Typography variant="h3" component="h3">
        Fields
      </Typography>
      {props.fields.map((field, index) => {
        return (
          <div key={"class_field_" + index}>
            {/* TODO: link to field type */}
            <div className="functionName">
              <strong>{field.name}</strong>
              {field.type && (
                <>
                  / <Type type={field.type} />{" "}
                </>
              )}
            </div>
            {field.toitdoc && <Toitdocs value={field.toitdoc} />}
          </div>
        );
      })}
    </div>
  );
}

const style = createStyles({
  root: {
    width: "100%",
  },
});

function mapStateToProps(
  state: RootState,
  props: ClassInfoProps
): ClassInfoProps {
  return {
    ...props,
    libraries: state.sdk.object?.libraries || {},
  };
}

interface ClassInfoParams {
  libName: string;
  moduleName: string;
  className: string;
}

interface ClassInfoProps extends WithStyles<typeof style> {
  libraries: ToitLibraries;
  match: match<ClassInfoParams>;
}

// Returns description of the class
class ClassInfo extends Component<ClassInfoProps> {
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
      <div className={this.props.classes.root}>
        <Grid container>
          <Grid item xs={12} sm={9}>
            <Box pt={2} pb={2}>
              <Typography variant="h2" component="h2">
                Class: {classInfo.name}
              </Typography>
              {classInfo.extends && <Extends reference={classInfo.extends} />}
            </Box>
            {classInfo.structure.constructors.length > 0 && (
              <Constructors
                constructors={classInfo.structure.constructors}
                libName={libName}
                moduleName={moduleName}
                className={className}
              />
            )}
            {classInfo.structure.factories.length > 0 && (
              <Factories
                factories={classInfo.structure.factories}
                libName={libName}
                moduleName={moduleName}
                className={className}
              />
            )}
            {classInfo.structure.statics.length > 0 && (
              <Statics
                statics={classInfo.structure.statics}
                libName={libName}
                moduleName={moduleName}
                className={className}
              />
            )}
            {classInfo.structure.methods.length > 0 && (
              <ClassMethods
                classMethods={classInfo.structure.methods}
                libName={libName}
                moduleName={moduleName}
                className={className}
              />
            )}
            {classInfo.structure.fields.length > 0 && (
              <Fields fields={classInfo.structure.fields} />
            )}
          </Grid>
          <Hidden xsDown>
            <Grid item sm={3}>
              <ClassContentList class={classInfo} />
            </Grid>
          </Hidden>
        </Grid>
      </div>
    );
  }
}

export default withStyles(style, { withTheme: true })(
  connect(mapStateToProps)(ClassInfo)
);
