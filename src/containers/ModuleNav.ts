import { connect } from "react-redux";
import ModuleNavView, {
  ModuleNavProps,
} from "../components/Module/ModuleNavView";
import { RootState } from "../sdk";

function mapStateToProps(state: RootState): Pick<ModuleNavProps, "libraries"> {
  return {
    libraries: state.sdk.object?.libraries || {},
  };
}

export default connect(mapStateToProps)(ModuleNavView);
