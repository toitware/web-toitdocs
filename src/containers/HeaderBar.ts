import { connect } from "react-redux";
import HeaderBarComponent, {
  HeaderBarProps,
} from "../components/HeaderBarComponent";
import { RootState } from "../sdk";

const mapStateToProps = (
  state: RootState
): Pick<HeaderBarProps, "searchObject"> => {
  return {
    searchObject: state.sdk.searchObject || {
      libraries: [],
      modules: [],
      classes: [],
      functions: [],
    },
  };
};

export default connect(mapStateToProps)(HeaderBarComponent);
