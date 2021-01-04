import { connect } from "react-redux";
import { ClassInfoProps } from "../components/Class/ClassInfo";
import ClassInfoView from "../components/ClassInfoView";
import { RootState } from "../sdk";

const mapStateToProps = (
  state: RootState
): Pick<ClassInfoProps, "libraries"> => {
  return {
    libraries: state.sdk.object?.libraries || {},
  };
};

export default connect(mapStateToProps)(ClassInfoView);
