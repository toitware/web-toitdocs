import { connect } from "react-redux";
import LibraryInfoView, {
  LibraryInfoProps,
} from "../components/LibraryInfoView";
import { RootState } from "../sdk";

function mapStateToProps(
  state: RootState
): Pick<LibraryInfoProps, "libraries"> {
  return {
    libraries: state.sdk.object?.libraries || {},
  };
}

export default connect(mapStateToProps)(LibraryInfoView);
