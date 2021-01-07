import { Divider, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { HashLink } from "react-router-hash-link";
import { ToitDoc } from "../model/toitsdk";
import Toitdocs from "./ToitdocInfo";

interface DetailsListProps {
  title: string;
  elements: {
    name: string;
    description: JSX.Element;
    key: string;
    id: string;
    toitdoc?: ToitDoc;
  }[];
}

const useStyles = makeStyles((theme) => ({
  details: { paddingBottom: theme.spacing(3) },
  title: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    color: theme.palette.primary.dark,
  },
  element: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  toitdoc: {
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(2),
  },
}));

export default function DetailsList(props: DetailsListProps): JSX.Element {
  const classes = useStyles();
  return (
    <div className={classes.details}>
      <div className={classes.title}>
        <Typography variant="h4">{props.title}</Typography>
      </div>
      <Divider />
      {props.elements
        .concat([])
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((element, i) => {
          return (
            <div key={element.key} id={element.id}>
              <div className={classes.element}>
                <div>
                  <HashLink to={{ hash: element.id }}>{element.name}</HashLink>{" "}
                  {element.description}
                </div>
                {element.toitdoc && (
                  <div className={classes.toitdoc}>
                    <Toitdocs value={element.toitdoc} />
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
