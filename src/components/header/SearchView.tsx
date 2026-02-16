// Copyright (C) 2024 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import {
    ClickAwayListener,
} from "@mui/material";
import Fuse from "fuse.js";
import React from "react";
import { makeStyles } from "tss-react/mui";
import {
    SearchableClass,
    SearchableFunction,
    SearchableInterface,
    SearchableLibrary,
    SearchableMethod,
    SearchableMixin,
    SearchableModel,
} from "../../model/search";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";

export const SEARCH_BAR_WIDTH = 300;
export const SEARCH_RESULTS_WIDTH = 400;

const useStyles = makeStyles()(() => ({
  searchBar: {
    width: SEARCH_BAR_WIDTH,
    marginLeft: "auto",
  },
}));

export interface SearchProps {
  model: SearchableModel;
}

interface SearchState {
  searchBy: string;
  libraries: SearchableLibrary[];
  classes: SearchableClass[];
  interfaces: SearchableInterface[];
  mixins: SearchableMixin[];
  functions: SearchableFunction[];
  methods: SearchableMethod[];
  hideResults: boolean;
}

let delayTimer: number;

function SearchViewInner(props: SearchProps): JSX.Element {
  const { classes } = useStyles();
  const [state, setState] = React.useState<SearchState>({
    searchBy: "",
    libraries: [],
    classes: [],
    interfaces: [],
    mixins: [],
    functions: [],
    methods: [],
    hideResults: false,
  });

  function search<T extends { name: string }>(
    searchIn: T[],
    searchBy: string
  ): Fuse.FuseResult<T>[] {
    const options = {
      keys: ["name"],
      threshold: 0.01,
      distance: 10000000,
    };
    return new Fuse(searchIn, options).search(searchBy);
  }

  const onSearch = (searchString: string): void => {
    setState((prev) => ({ ...prev, searchBy: searchString }));

    clearTimeout(delayTimer);
    delayTimer = window.setTimeout(
      () => {
        let libraries = [] as SearchableLibrary[];
        let classes = [] as SearchableClass[];
        let interfaces = [] as SearchableInterface[];
        let mixins = [] as SearchableMixin[];
        let functions = [] as SearchableFunction[];
        let methods = [] as SearchableMethod[];

        if (searchString && searchString.length > 1) {
          libraries = search(props.model.libraries, searchString).map(
            (m) => m.item
          );
          interfaces = search(
            props.model.interfaces,
            searchString
          ).map((inter) => inter.item);
          mixins = search(props.model.mixins, searchString).map(
            (mixin) => mixin.item
          );
          classes = search(props.model.classes, searchString).map(
            (c) => c.item
          );
          functions = search(props.model.functions, searchString).map(
            (f) => f.item
          );
          methods = search(props.model.methods, searchString).map(
            (m) => m.item
          );
        }

        setState({
          searchBy: searchString,
          libraries: libraries,
          interfaces: interfaces,
          classes: classes,
          mixins: mixins,
          functions: functions,
          methods: methods,
          hideResults: false,
        });
      },
      searchString ? 200 : 0
    );
  };

  const onFocus = (): void => {
    setState((prev) => ({ ...prev, hideResults: false }));
  };

  const onClickAway = (): void => {
    setState((prev) => ({ ...prev, hideResults: true }));
  };

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <div className={classes.searchBar}>
        <SearchBar
          searchBy={state.searchBy}
          onSearch={onSearch}
          onFocus={onFocus}
        />
        <SearchResults
          results={[
            ...state.classes,
            ...state.interfaces,
            ...state.functions,
            ...state.methods,
            ...state.libraries,
          ]}
          hideResults={state.hideResults}
        />
      </div>
    </ClickAwayListener>
  );
}

export default SearchViewInner;
