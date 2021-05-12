// Copyright (C) 2021 Toitware ApS. All rights reserved.

import { connect } from "react-redux";
import SummaryView, {
  SummaryViewProps,
} from "../../components/main/SummaryView";
import { RootState } from "../../redux/sdk";

const mapStateToProps = (
  state: RootState
): Pick<SummaryViewProps, "libraries"> => {
  return {
    libraries: state.sdk.libraries || {},
  };
};

export default connect(mapStateToProps)(SummaryView);
