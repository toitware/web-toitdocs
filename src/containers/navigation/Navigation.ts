import { connect } from "react-redux";
import NavigationView, {
  NavigationProps,
} from "../../components/navigation/NavigationView";
import { RootState } from "../../redux/sdk";

function mapStateToProps(state: RootState): Pick<NavigationProps, "modules"> {
  return {
    modules: state.sdk.modules || {},
  };
}

export default connect(mapStateToProps)(NavigationView);
