import { connect } from "react-redux";
import ClassInfoView, {
  ClassInfoProps,
} from "../../components/main/ClassInfoView";
import { RootState } from "../../redux/sdk";

const mapStateToProps = (state: RootState): Pick<ClassInfoProps, "modules"> => {
  return {
    modules: state.sdk.modules || {},
  };
};

export default connect(mapStateToProps)(ClassInfoView);
