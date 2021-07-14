import { connect } from "react-redux";
import NavigationView, {
  NavigationProps,
} from "../../components/navigation/NavigationView";
import { RootState } from "../../redux/doc";

function mapStateToProps(state: RootState): Pick<NavigationProps, "libraries"> {
  return {
    libraries: state.doc.libraries || {},
  };
}

export default connect(mapStateToProps)(NavigationView);
