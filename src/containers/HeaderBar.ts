import { connect } from "react-redux";
import HeaderBarComponent, {
  HeaderBarProps,
} from "../components/HeaderBarComponent";
import { RootState } from "../sdk";

const mapStateToProps = (
  state: RootState
): Pick<HeaderBarProps, "searchObject"> => {
  return {
    searchObject: state.searchObject || {
      libraries: [],
      modules: [],
      classes: [],
    },
  };
};

export default connect(mapStateToProps)(HeaderBarComponent);
