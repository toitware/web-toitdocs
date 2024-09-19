// Copyright (C) 2024 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import {
  List,
  ListItem,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from "@material-ui/core";
import React from "react";
import {
  Searchable,
  SearchableClass,
  SearchableFunction,
  SearchableInterface,
  SearchableLibrary,
  SearchableMethod,
} from "../../model/search";
import { SEARCH_BAR_WIDTH, SEARCH_RESULTS_WIDTH } from "./SearchView";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: "fixed",
    width: SEARCH_RESULTS_WIDTH,
    maxHeight: 500,
    overflow: "auto",
    marginTop: 2,
    marginLeft: SEARCH_BAR_WIDTH - SEARCH_RESULTS_WIDTH,
  },
  listItem: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
  },
  text: {
    display: "inline",
    color: theme.palette.secondary.main,
  },
  emphText: {
    display: "inline",
    color: theme.palette.primary.dark,
  },
}));

interface SearchResultsProps {
  results: Searchable[];
  hideResults: boolean;
}

export default function SearchResults(props: SearchResultsProps): JSX.Element {
  const classes = useStyles();

  const results = props.results.map((item, index) => (
    <ResultItem item={item} key={"resultItem" + index} />
  ));

  return (
    <>
      {!props.hideResults && results.length > 0 && (
        <Paper className={classes.root} square>
          <List>{results}</List>
        </Paper>
      )}
    </>
  );
}

function ResultItem(props: { item: Searchable }): JSX.Element {
  const classes = useStyles();

  let name = "";
  let from = "";

  switch (props.item.type) {
    case "library": {
      const item = props.item as SearchableLibrary;
      name = item.name;
      from = item.ref.path.join(".");
      break;
    }
    case "interface": {
      const item = props.item as SearchableInterface;
      name = item.name;
      from = item.ref.libraryRef.path.join(".");
      break;
    }
    case "mixin": {
      const item = props.item as SearchableInterface;
      name = item.name;
      from = item.ref.libraryRef.path.join(".");
      break;
    }
    case "class": {
      const item = props.item as SearchableClass;
      name = item.name;
      from = item.ref.libraryRef.path.join(".");
      break;
    }
    case "function": {
      const item = props.item as SearchableFunction;
      name = item.name + " " + item.parameters + " ";
      from = item.ref.libraryRef.path.join(".");
      break;
    }
    case "method": {
      const item = props.item as SearchableMethod;
      name = item.name + " " + item.parameters + " ";
      from =
        item.className + " in " + item.ref.classRef.libraryRef.path.join(".");
      break;
    }
  }

  return (
    <ListItem
      button
      component="a"
      href={"." + props.item.url}
      className={classes.listItem}
    >
      <div>
        <Typography className={classes.text}>{name} </Typography>
        <Typography className={classes.emphText}>{props.item.type}</Typography>
      </div>
      {from && (
        <div>
          <Typography variant="body2" className={classes.emphText}>
            from {from}
          </Typography>
        </div>
      )}
    </ListItem>
  );
}
