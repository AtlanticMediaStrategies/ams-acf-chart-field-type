import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import Velocity from 'velocity-animate'


const RADIUS_WIDTH = 4

export default class Dot extends Component {

  constructor(props) {
    super(props)
    this.state = {
      active: false
    }
  }

  static propTypes = {
    index: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
    fill: PropTypes.string,
    text: PropTypes.number,
    setActiveLine: PropTypes.any,
    removeTooltip: PropTypes.any
  }

  animate_in(e) {
    const text = (this.props.text) ? `${this.props.text}%` : '';
    this.props.setActiveLine(text, e)
    const dot = ReactDOM.findDOMNode(this)
    Velocity(dot, {r: RADIUS_WIDTH * 2}, {duration: 300, easing: "ease"})
  }

  animate_out() {
    this.props.removeTooltip()
    const dot = ReactDOM.findDOMNode(this)
    Velocity(dot, {r: RADIUS_WIDTH}, {duration: 300, easeing: "ease"})
  }

  render() {

    const {x, y, fill } = this.props

    return (
      <circle
        className="dot"
        r={ RADIUS_WIDTH }
        width={ RADIUS_WIDTH }
        height={ RADIUS_WIDTH }
        style={{ fill }}
        cx={ x }
        cy={ y }
        onMouseEnter={ this.animate_in.bind(this) }
        onMouseLeave={ this.animate_out.bind(this) }
      >
      </circle>
    )
  }
}
