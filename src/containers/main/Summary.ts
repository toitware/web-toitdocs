// Copyright (C) 2021 Toitware ApS. All rights reserved.

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
