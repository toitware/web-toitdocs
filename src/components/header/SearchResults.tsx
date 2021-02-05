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
  SearchableClass,
  SearchableFunction,
  SearchableMethod,
  SearchableModule,
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
  modules: SearchableModule[];
  classes: SearchableClass[];
  functions: SearchableFunction[];
  methods: SearchableMethod[];
  hideResults: boolean;
}

function resultItems(
  classes: SearchableClass[],
  functions: SearchableFunction[],
  methods: SearchableMethod[],
  modules: SearchableModule[]
): JSX.Element[] {
  const classItems = classes.map((c, index) => (
    <ResultItem
      key={"class-" + index}
      name={c.name}
      type="class"
      from={c.ref.moduleRef.path.join(".")}
      url={c.url}
    />
  ));
  const functionItems = functions.map((f, index) => (
    <ResultItem
      key={"function-" + index}
      name={f.name + " " + f.parameters + " "}
      type="function"
      from={f.ref.moduleRef.path.join(".")}
      url={f.url}
    />
  ));
  const methodItems = methods.map((m, index) => {
    return (
      <ResultItem
        key={"method-" + index}
        name={m.name + " " + m.parameters + " "}
        type="method"
        from={m.className + " in " + m.ref.classRef.moduleRef.path.join(".")}
        url={m.url}
      />
    );
  });
  const moduleItems = modules.map((m, index) => (
    <ResultItem
      key={"module-" + index}
      name={m.name}
      type="module"
      from={m.ref.path.join(".")}
      url={m.url}
    />
  ));
  return [...classItems, ...functionItems, ...methodItems, ...moduleItems];
}

export default function SearchResults(props: SearchResultsProps): JSX.Element {
  const classes = useStyles();

  const results = resultItems(
    props.classes,
    props.functions,
    props.methods,
    props.modules
  );

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

function ResultItem(props: {
  name: string;
  type: string;
  from?: string;
  url: string;
}): JSX.Element {
  const classes = useStyles();

  return (
    <ListItem
      button
      component="a"
      href={props.url}
      className={classes.listItem}
    >
      <div>
        <Typography className={classes.text}>{props.name} </Typography>
        <Typography className={classes.emphText}>{props.type}</Typography>
      </div>
      {props.from && (
        <div>
          <Typography variant="body2" className={classes.emphText}>
            from {props.from}
          </Typography>
        </div>
      )}
    </ListItem>
  );
}
