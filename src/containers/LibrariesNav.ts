import { connect } from "react-redux";
import LibrariesNavView, {
  LibrariesNavProps,
} from "../components/Library/LibrariesNavView";
import { RootState } from "../sdk";

function mapStateToProps(
  state: RootState
): Pick<LibrariesNavProps, "libraries"> {
  return {
    libraries: state.sdk.object?.libraries || {},
  };
}

export default connect(mapStateToProps)(LibrariesNavView);
