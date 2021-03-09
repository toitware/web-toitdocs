import { connect } from "react-redux";
import LibraryInfoView, {
  LibraryInfoProps,
} from "../../components/main/LibraryInfoView";
import { RootState } from "../../redux/sdk";

function mapStateToProps(
  state: RootState
): Pick<LibraryInfoProps, "libraries"> {
  return {
    libraries: state.sdk.libraries || {},
  };
}

export default connect(mapStateToProps)(LibraryInfoView);
