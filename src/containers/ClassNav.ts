import { connect } from "react-redux";
import ClassNavView, { ClassNavProps } from "../components/ClassNavView";
import { RootState } from "../redux/sdk";

function mapStateToProps(state: RootState): Pick<ClassNavProps, "libraries"> {
  return {
    libraries: state.sdk.object?.libraries || {},
  };
}

export default connect(mapStateToProps)(ClassNavView);
