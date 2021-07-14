import { Divider, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { Doc } from "../../model/model";
import Toitdocs from "../doc/Toitdocs";

interface DetailsListProps {
  title: string;
  elements: {
    name: string;
    description: JSX.Element;
    key: string;
    id: string;
    toitdoc?: Doc;
    toitdocHeaderOnly?: boolean;
    link?: string;
    isInherited: boolean;
  }[];
}

const useStyles = makeStyles((theme) => ({
  details: { paddingBottom: theme.spacing(3) },
  title: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
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

function name(name: string, id: string, link?: string): JSX.Element {
  if (link) {
    return <Link to={link}>{name}</Link>;
  } else {
    return <HashLink to={{ hash: id }}>{name}</HashLink>;
  }
}

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
                  {name(element.name, element.id, element.link)}{" "}
                  {element.description}
                </div>
                {element.isInherited && <em>inherited</em>}
                {element.toitdoc && (
                  <div className={classes.toitdoc}>
                    <Toitdocs
                      value={element.toitdoc}
                      headerOnly={element.toitdocHeaderOnly}
                    />
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
