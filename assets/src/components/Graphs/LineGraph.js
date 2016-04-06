import React, {Component} from 'react'
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis
} from 'victory'

import moment from 'moment'
import Vivus from 'vivus'
import ReactDOM from 'react-dom'

export default class LineGraph extends Component {

  constructor(props) {
    super(props)
    this.state = {
      animated: false
    }
  }

  componentWillReceiveProps({ready, disableAnimation}) {
    if(ready === true && disableAnimation !== true) {
      const elm = ReactDOM.findDOMNode(this)
      new Vivus(elm)
    }
  }

  render() {
    let {
      data,
      width,
      colors,
      x_axis,
      y_axis,
      ready,
      active_columns
    } = this.props;

    if(!data || !width) {
      return <div></div>
    }

    data = [...data]

    const dates = data.shift();
    const x_values = dates.map((date, i) => {
      if(i == 0) return
      // TODO: flexible x axis
      const parsed_date = date.replace('/', '/20');
      return new moment(parsed_date, 'M/YYYY').toDate()
    })

    const lines =
      data
        .map((datum, i) => {
          if(datum === false) {
            return datum
          }
          const label = datum[0]
          let line_data;
          line_data = active_columns.map((j) => {
            return {
              x: x_values[j],
              y: parseInt(datum[j])
            }
          })

          return (
            <VictoryLine
              style={{
                data: {
                  stroke: colors[i + 1],
                  strokeWidth: 4
                }
              }}
              key={i}
              label={label}
              interpolation='monotone'
              padding={100}
              data={line_data}>
            </VictoryLine>
          );
      })
      .filter((datum) => datum !== false)

    const padding = {
      top: 50,
      right: 120,
      bottom: 50,
      left: 50
    }

    // shift blank first row/column
    x_values.shift()

    // calculate height and try to keep same ratio
    let height = width / 2.56;

    // min-height for graph
    if(height < 300) {
      height = 300
    }

    const axisPadding = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    }

    return (
      <VictoryChart
        height={height}
        width={width}
        padding={padding}
      >
        {lines}
        <VictoryAxis
          standalone={true}
          dependentAxis
          label={y_axis}
          padding={axisPadding}
        >
        </VictoryAxis>
        <VictoryAxis
          scale="time"
          label={x_axis}
          padding={axisPadding}
          tickFormat={(date) => new moment(date).format('MM/YYYY')}
          >
        </VictoryAxis>
      </VictoryChart>
    )
  }
}
