import { connect } from "react-redux";
import ModuleNavView, { ModuleNavProps } from "../components/ModuleNavView";
import { RootState } from "../redux/sdk";

function mapStateToProps(state: RootState): Pick<ModuleNavProps, "libraries"> {
  return {
    libraries: state.sdk.object?.libraries || {},
  };
}

export default connect(mapStateToProps)(ModuleNavView);
