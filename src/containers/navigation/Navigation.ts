import { connect } from "react-redux";
import NavigationView, {
  NavigationProps,
} from "../../components/navigation/NavigationView";
import { RootState } from "../../redux/sdk";

function mapStateToProps(state: RootState): Pick<NavigationProps, "libraries"> {
  return {
    libraries: state.sdk.libraries || {},
  };
}

export default connect(mapStateToProps)(NavigationView);
