function mapStateToProps(
  state: RootState,
  props: LibraryInfoProps
): LibraryInfoProps {
  return {
    ...props,
    libraries: state.sdk.object?.libraries || {},
  };
}
