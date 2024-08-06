// Copyright (C) 2024 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import { connect } from "react-redux";
import LibraryInfoView, {
  LibraryInfoProps,
} from "../../components/main/LibraryInfoView";
import { RootState } from "../../redux/doc";

function mapStateToProps(
  state: RootState
): Pick<LibraryInfoProps, "libraries"> {
  return {
    libraries: state.doc.libraries || {},
  };
}

export default connect(mapStateToProps)(LibraryInfoView);
