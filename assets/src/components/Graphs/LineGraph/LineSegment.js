/**
 * Original code at https://github.com/FormidableLabs/victory-chart/blob/master/src/components/victory-line/line-segment.jsx
 */

import React, { PropTypes } from "react"
import d3Shape from "d3-shape"
import { Helpers } from "victory-core"
import classnames from 'classnames'
import Dot from './Dot.js'

export default class LineSegment extends React.Component {
  static propTypes = {
    lineX: PropTypes.number,
    setActiveLine: PropTypes.any,
    index: PropTypes.number,
    order: PropTypes.number,
    data: PropTypes.array,
    events: PropTypes.object,
    interpolation: PropTypes.string,
    removeTooltip: PropTypes.any,
    scale: PropTypes.object,
    style: PropTypes.object,
    disableAnimation: PropTypes.boolean
  };

  toNewName(interpolation) {
    // d3 shape changed the naming scheme for interpolators from "basis" -> "curveBasis" etc.
    const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);
    return `curve${capitalize(interpolation)}`;
  }

  render() {
    const { props } = this;
    const style = Helpers.evaluateStyle(props.style, props.data);
    const interpolation = Helpers.evaluateProp(props.interpolation, props.data);
    const xScale = props.scale.x;
    const yScale = props.scale.y;
    const circles = []
    const body = document.querySelector('body')
    const lineFunction = d3Shape.line()
      .curve(d3Shape[this.toNewName(interpolation)])
      .x((data) => xScale(data.x))
      .y((data, i) => {
        /**
         *  hacky code to insert circles at the x/y intersections
         */
        const LIMIT = 5
        const diff = this.props.lineX - xScale(data.x)
        const IS_ACTIVE  = (diff > (LIMIT * -1) && diff < LIMIT)

        if(body.offsetWidth <= 768 || this.props.disableAnimation ) {
          return yScale(data.y)
        }
        circles.push(
          <Dot
            index={ props.order }
            key={ i }
            setActiveLine={ props.setActiveLine }
            removeTooltip={ props.removeTooltip }
            x={ xScale(data.x) }
            y={ yScale(data.y) }
            fill={ style.stroke }
            text={ data.y }
          ></Dot>
        )
        return yScale(data.y)
      })
    const path = lineFunction(props.data);
    const events = Helpers.getPartialEvents(props.events, props.index, props);
    return (
      <g>
        <path
          style={style}
          d={path}
          {...events}/>
        {circles}
      </g>
    );
  }
}
