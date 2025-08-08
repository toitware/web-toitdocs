// Copyright (C) 2024 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import {
  Box,
  createStyles,
  InputBase,
  makeStyles,
  Theme,
} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from "@material-ui/icons/Search";
import React, { memo } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    search: {
      padding: "2px 4px",
      display: "flex",
      alignItems: "center",
      flex: 1,
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    clearIcon: {
      marginRight: theme.spacing(2),
      cursor: "pointer",
    },
  }),
);

interface SearchBarProps {
  searchBy: string;
  onSearch: (searchString: string) => void;
  onFocus?: () => void;
}

function SearchBar(props: SearchBarProps): JSX.Element {
  const handleSearchStringChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    props.onSearch(event.target.value);
  };

  const resetSearchString = (): void => {
    if (props.searchBy) {
      props.onSearch("");
    }
  };

  const classes = useStyles();

  return (
    <>
      <Box
        className={classes.search}
        border={1}
        borderLeft={0}
        borderTop={0}
        borderRight={0}
      >
        <SearchIcon />
        <InputBase
          className={classes.input}
          placeholder="Search"
          inputProps={{ "aria-label": "search devices" }}
          onChange={handleSearchStringChange}
          value={props.searchBy}
          onClick={(): void => {
            if (props.onFocus) {
              props.onFocus();
            }
          }}
        />
        <ClearIcon
          fontSize="small"
          className={classes.clearIcon}
          onClick={resetSearchString}
        />
      </Box>
    </>
  );
}

export default memo(SearchBar);
