// Copyright (C) 2020 Toitware ApS. All rights reserved.

import React from "react";
import { ToitClass } from "../model/toitsdk";

interface ClassContentListProps {
  class: ToitClass;
}

export default class ClassContentList extends React.Component<ClassContentListProps> {
  render(): JSX.Element {
    return (
      <div>
        {this.props.class.structure.constructors.length > 0 && (
          <div>
            <h4>Constructors</h4>
            <ul>
              {this.printList(
                this.props.class.structure.constructors,
                "constructors"
              )}
            </ul>
          </div>
        )}
        {this.props.class.structure.statics.length > 0 && (
          <div>
            <h4>Statics</h4>
            <ul>
              {this.printList(this.props.class.structure.statics, "statics")}
            </ul>
          </div>
        )}
        {this.props.class.structure.factories.length > 0 && (
          <div>
            <h4>Factories</h4>
            <ul>
              {this.printList(
                this.props.class.structure.factories,
                "factories"
              )}
            </ul>
          </div>
        )}
        {this.props.class.structure.methods.length > 0 && (
          <div>
            <h4>Methods</h4>
            <ul>
              {this.printList(this.props.class.structure.methods, "methods")}
            </ul>
          </div>
        )}
        {this.props.class.structure.fields.length > 0 && (
          <div>
            <h4>Fields</h4>
            <ul>
              {this.printList(this.props.class.structure.fields, "fields")}
            </ul>
          </div>
        )}
      </div>
    );
  }

  printList(objects: { name: string }[], keyGroup: string): JSX.Element[] {
    return objects.concat([]).map((obj, i) => {
      return <li key={"print_list_stat_" + keyGroup + +i}> {obj.name} </li>;
    });
  }
}
