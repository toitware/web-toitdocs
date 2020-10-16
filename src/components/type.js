import React, {Component} from "react"
import { Link } from "react-router-dom";

class Type extends Component {
  render() {
    const type = this.props.type || {}
    if (type.is_none) {
      return <span>none</span>
    }
    if (type.is_any) {
      return <span>any</span>
    }
    if (type.is_block) {
      return <span>[block]</span>
    }
    // TODO handle the reference for the type
    return (<span>
      <Link to={`/#todo`}>${type.reference.name}</Link>
    </span>)
  }
}

export default Type;
