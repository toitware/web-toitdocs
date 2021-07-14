import { connect } from "react-redux";
import LibraryInfoView, {
  LibraryInfoProps,
} from "../../components/main/LibraryInfoView";
import { RootState } from "../../redux/doc";

function mapStateToProps(
  state: RootState
): Pick<LibraryInfoProps, "libraries"> {
  return {
    libraries: state.doc.libraries || {},
  };
}

export default connect(mapStateToProps)(LibraryInfoView);
