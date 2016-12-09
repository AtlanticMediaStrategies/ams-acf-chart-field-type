import React, { Component } from 'react'
import classnames from 'classnames'

export default class Tooltip extends Component {

  render() {
    const { coords, value, active } = this.props

    const tooltip_classes = classnames({
      'dot__tooltip': true,
      'dot__tooltip--active': active
    })

    if(coords !== null) {
      const x = coords[0]
      const y = coords[1]

      var tooltip_styles = {
        left: `${x}px`,
        top: `${y - 180}px`
      }
    } else {
      var tooltip_styles = {}
    }

    return (
      <div className={tooltip_classes} style={ tooltip_styles }>
        <div className="dot__text">{ value }</div>
      </div>
    )
  }
}
