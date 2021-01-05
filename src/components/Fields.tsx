import { Divider, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { HashLink } from "react-router-hash-link";
import { ToitField } from "../model/toitsdk";
import Toitdocs from "./ToitdocInfo";
import { Type } from "./Util";

interface FieldsProps {
  fields: ToitField[];
}

const useStyles = makeStyles((theme) => ({
  fields: { paddingBottom: theme.spacing(3) },
  title: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    color: theme.palette.primary.dark,
  },
  field: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  toitdocs: {
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
}));

export default function Fields(props: FieldsProps): JSX.Element {
  const classes = useStyles();
  return (
    <div className={classes.fields}>
      <div className={classes.title}>
        <Typography variant="h4">Fields</Typography>
      </div>
      <Divider />
      {props.fields
        .concat([])
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((field, i) => {
          return (
            <div key={"field" + i} id={field.name}>
              <div className={classes.field}>
                <div>
                  <HashLink to={{ hash: field.name }}>{field.name}</HashLink>
                  <Type type={field.type} />
                </div>
                {field.toitdoc && (
                  <div className={classes.toitdocs}>
                    <Toitdocs value={field.toitdoc} />
                  </div>
                )}
              </div>
              <Divider />
            </div>
          );
        })}
    </div>
  );
}
