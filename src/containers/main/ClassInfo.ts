import { connect } from "react-redux";
import ClassInfoView, {
  ClassInfoProps,
} from "../../components/main/ClassInfoView";
import { RootState } from "../../redux/doc";

const mapStateToProps = (
  state: RootState
): Pick<ClassInfoProps, "libraries"> => {
  return {
    libraries: state.doc.libraries || {},
  };
};

export default connect(mapStateToProps)(ClassInfoView);
