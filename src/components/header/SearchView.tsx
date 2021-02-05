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
  SearchableMethod,
  SearchableModel,
  SearchableModule,
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
  modules: SearchableModule[];
  classes: SearchableClass[];
  functions: SearchableFunction[];
  methods: SearchableMethod[];
  hideResults: boolean;
}

let delayTimer: number;

class SearchView extends React.Component<SearchProps, SearchState> {
  state = {
    searchBy: "",
    modules: [],
    classes: [],
    functions: [],
    methods: [],
    hideResults: false,
  };

  search<T extends { name: string }>(
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

  onSearch = (searchString: string): void => {
    this.setState({ ...this.state, searchBy: searchString });

    clearTimeout(delayTimer);
    delayTimer = window.setTimeout(
      () => {
        let modules = [] as SearchableModule[];
        let classes = [] as SearchableClass[];
        let functions = [] as SearchableFunction[];
        let methods = [] as SearchableMethod[];

        if (searchString && searchString.length > 1) {
          modules = this.search(this.props.model.modules, searchString).map(
            (m) => m.item
          );
          classes = this.search(this.props.model.classes, searchString).map(
            (c) => c.item
          );
          functions = this.search(this.props.model.functions, searchString).map(
            (f) => f.item
          );
          methods = this.search(this.props.model.methods, searchString).map(
            (m) => m.item
          );
        }

        this.setState({
          ...this.state,
          searchBy: searchString,
          modules: modules,
          classes: classes,
          functions: functions,
          methods: methods,
        });
      },
      searchString ? 200 : 0
    );
  };

  onFocus = (): void => {
    this.setState({ ...this.state, hideResults: false });
  };

  onClickAway = (): void => {
    this.setState({ ...this.state, hideResults: true });
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
              ...this.state.functions,
              ...this.state.methods,
              ...this.state.modules,
            ]}
            hideResults={this.state.hideResults}
          />
        </div>
      </ClickAwayListener>
    );
  }
}

export default withStyles(styles)(SearchView);
