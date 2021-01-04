import { connect } from "react-redux";
import ModuleInfoView, {
  ModuleInfoProps,
} from "../components/Module/ModuleInfoView";
import { RootState } from "../sdk";

function mapStateToProps(state: RootState): Pick<ModuleInfoProps, "libraries"> {
  return {
    libraries: state.sdk.object?.libraries || {},
  };
}

export default connect(mapStateToProps)(ModuleInfoView);
