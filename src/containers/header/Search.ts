// Copyright (C) 2024 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import { connect } from "react-redux";
import SearchView, { SearchProps } from "../../components/header/SearchView";
import { RootState } from "../../redux/doc";

const mapStateToProps = (state: RootState): Pick<SearchProps, "model"> => {
  return {
    model: state.doc.searchableModel || {
      libraries: [],
      classes: [],
      interfaces: [],
      mixins: [],
      functions: [],
      methods: [],
    },
  };
};

export default connect(mapStateToProps)(SearchView);
