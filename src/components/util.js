import React, {Component} from "react"
import { Link } from "react-router-dom";

export class Type extends Component {
  render() {
    const type = this.props.type;
    if (type.is_none) {
      return <span>none</span>
    }
    if (type.is_any) {
      return <span>any</span>
    }
    if (type.is_block) {
      return <span>[block]</span>
    }
    return <span><Reference reference={type.reference} /></span>
  }
}

export class Reference extends Component {
  render() {
    // TODO handle the reference for the type
    const reference = this.props.reference;
    return <Link to={`/#todo`}>{reference.name}</Link>
  }
}
