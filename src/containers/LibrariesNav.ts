import { connect } from "react-redux";
import LibrariesNavView, {
  LibrariesNavProps,
} from "../components/LibrariesNavView";
import { RootState } from "../redux/sdk";

function mapStateToProps(
  state: RootState
): Pick<LibrariesNavProps, "libraries"> {
  return {
    libraries: state.sdk.object?.libraries || {},
  };
}

export default connect(mapStateToProps)(LibrariesNavView);
