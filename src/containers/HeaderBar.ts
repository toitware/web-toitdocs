import { connect } from "react-redux";
import HeaderBarView, { HeaderBarProps } from "../components/HeaderBarView";
import { RootState } from "../sdk";

const mapStateToProps = (
  state: RootState
): Pick<HeaderBarProps, "searchObject"> => {
  return {
    searchObject: state.sdk.searchObject || {
      libraries: [],
      modules: [],
      classes: [],
    },
  };
};

export default connect(mapStateToProps)(HeaderBarView);
