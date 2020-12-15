import { connect } from "react-redux";
import ClassInfoView, { ClassInfoProps } from "../components/ClassInfo";
import { RootState } from "../sdk";

const mapStateToProps = (
  state: RootState
): Pick<ClassInfoProps, "libraries"> => {
  return {
    libraries: state.sdk.object?.libraries || {},
  };
};

export default connect(mapStateToProps)(ClassInfoView);
