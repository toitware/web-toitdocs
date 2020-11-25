import React from "react";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { Link } from "react-router-dom";

export default function ListItemLink(props) {
  const { icon, primary, to } = props;

  const CustomLink = React.useMemo(
    () =>
      React.forwardRef((linkProps, ref) => (
        <Link ref={ref} to={to} {...linkProps} />
      )),
    [to]
  );
  return (
    <li>
      <ListItem button component={CustomLink}>
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}
