import { connect } from "react-redux";
import SearchView, { SearchProps } from "../../components/header/SearchView";
import { RootState } from "../../redux/sdk";

const mapStateToProps = (state: RootState): Pick<SearchProps, "model"> => {
  return {
    model: state.sdk.searchableModel || {
      libraries: [],
      classes: [],
      interfaces: [],
      functions: [],
      methods: [],
    },
  };
};

export default connect(mapStateToProps)(SearchView);
