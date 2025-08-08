// Copyright (C) 2024 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import {
  ClickAwayListener,
  createStyles,
  withStyles,
  WithStyles,
} from "@material-ui/core";
import Fuse from "fuse.js";
import React from "react";
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

const styles = createStyles({
  searchBar: {
    width: SEARCH_BAR_WIDTH,
    marginLeft: "auto",
  },
});

export interface SearchProps extends WithStyles<typeof styles> {
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

class SearchView extends React.Component<SearchProps, SearchState> {
  state = {
    searchBy: "",
    libraries: [],
    classes: [],
    interfaces: [],
    mixins: [],
    functions: [],
    methods: [],
    hideResults: false,
  };

  search<T extends { name: string }>(
    searchIn: T[],
    searchBy: string,
  ): Fuse.FuseResult<T>[] {
    const options = {
      keys: ["name"],
      threshold: 0.01,
      distance: 10000000,
    };
    return new Fuse(searchIn, options).search(searchBy);
  }

  onSearch = (searchString: string): void => {
    this.setState({ searchBy: searchString });

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
          libraries = this.search(this.props.model.libraries, searchString).map(
            (m) => m.item,
          );
          interfaces = this.search(
            this.props.model.interfaces,
            searchString,
          ).map((inter) => inter.item);
          mixins = this.search(this.props.model.mixins, searchString).map(
            (mixin) => mixin.item,
          );
          classes = this.search(this.props.model.classes, searchString).map(
            (c) => c.item,
          );
          functions = this.search(this.props.model.functions, searchString).map(
            (f) => f.item,
          );
          methods = this.search(this.props.model.methods, searchString).map(
            (m) => m.item,
          );
        }

        this.setState({
          searchBy: searchString,
          libraries: libraries,
          interfaces: interfaces,
          classes: classes,
          mixins: mixins,
          functions: functions,
          methods: methods,
        });
      },
      searchString ? 200 : 0,
    );
  };

  onFocus = (): void => {
    this.setState({ hideResults: false });
  };

  onClickAway = (): void => {
    this.setState({ hideResults: true });
  };

  render(): JSX.Element {
    return (
      <ClickAwayListener onClickAway={this.onClickAway}>
        <div className={this.props.classes.searchBar}>
          <SearchBar
            searchBy={this.state.searchBy}
            onSearch={this.onSearch}
            onFocus={this.onFocus}
          />
          <SearchResults
            results={[
              ...this.state.classes,
              ...this.state.interfaces,
              ...this.state.functions,
              ...this.state.methods,
              ...this.state.libraries,
            ]}
            hideResults={this.state.hideResults}
          />
        </div>
      </ClickAwayListener>
    );
  }
}

export default withStyles(styles)(SearchView);
