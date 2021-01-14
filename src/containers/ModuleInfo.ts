import { connect } from "react-redux";
import ModuleInfoView, { ModuleInfoProps } from "../components/ModuleInfoView";
import { RootState } from "../redux/sdk";

function mapStateToProps(state: RootState): Pick<ModuleInfoProps, "libraries"> {
  return {
    libraries: state.sdk.object?.libraries || {},
  };
}

export default connect(mapStateToProps)(ModuleInfoView);
