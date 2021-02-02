import { connect } from "react-redux";
import ModuleInfoView, { ModuleInfoProps } from "../components/ModuleInfoView";
import { RootState } from "../redux/sdk";

function mapStateToProps(state: RootState): Pick<ModuleInfoProps, "modules"> {
  return {
    modules: state.sdk.modules || {},
  };
}

export default connect(mapStateToProps)(ModuleInfoView);
