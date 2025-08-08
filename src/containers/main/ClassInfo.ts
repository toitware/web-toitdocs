// Copyright (C) 2024 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import { connect } from "react-redux";
import ClassInfoView, {
  ClassInfoProps,
} from "../../components/main/ClassInfoView";
import { RootState } from "../../redux/doc";

const mapStateToProps = (
  state: RootState,
): Pick<ClassInfoProps, "libraries"> => {
  return {
    libraries: state.doc.libraries || {},
  };
};

export default connect(mapStateToProps)(ClassInfoView);
