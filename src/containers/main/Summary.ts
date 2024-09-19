// Copyright (C) 2021 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import { connect } from "react-redux";
import SummaryView, {
  SummaryViewProps,
} from "../../components/main/SummaryView";
import { RootState } from "../../redux/doc";

const mapStateToProps = (
  state: RootState
): Pick<SummaryViewProps, "libraries"> => {
  return {
    libraries: state.doc.libraries || {},
  };
};

export default connect(mapStateToProps)(SummaryView);
