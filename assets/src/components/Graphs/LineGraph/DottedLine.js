import React, { Component } from 'react'
import styles from './line-graph.scss'

export default class DottedLine extends Component {

  static propTypes = {
    lineX: React.PropTypes.number,
    opacity: React.PropTypes.number
  }

  render() {

    const {
      lineX,
      opacity
    } = this.props

    const styles = {
      transform: `translateX(${lineX}px)`,
      opacity
    }

    return (
      <div className="dotted-line" style={ styles }></div>
    )
  }
}
