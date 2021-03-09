import { connect } from "react-redux";
import ClassInfoView, {
  ClassInfoProps,
} from "../../components/main/ClassInfoView";
import { RootState } from "../../redux/sdk";

const mapStateToProps = (
  state: RootState
): Pick<ClassInfoProps, "libraries"> => {
  return {
    libraries: state.sdk.libraries || {},
  };
};

export default connect(mapStateToProps)(ClassInfoView);
