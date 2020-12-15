import {
  createStyles,
  StyleRules,
  Theme,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import React from "react";

const styles = (theme: Theme): StyleRules =>
  createStyles({
    container: {
      position: "relative",
      height: "100%",
    },
    containerInner: {
      position: "absolute",
      height: "100%",
      width: "100%",
      overflowY: "auto",
      overflowX: "hidden",
    },
  });

type ScrollableContainerProps = WithStyles<typeof styles>;

class ScrollableContainer extends React.Component<ScrollableContainerProps> {
  render(): JSX.Element {
    return (
      <div className={this.props.classes.container}>
        <div className={this.props.classes.containerInner}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ScrollableContainer);
