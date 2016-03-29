import React, {Component} from 'react'
import {
  VictoryChart,
  VictoryLine,
  VictoryAnimation,
  VictoryAxis
} from 'victory'

import moment from 'moment'

export default class LineGraph extends Component {

  render() {
    let {
      data,
      width,
      colors
    } = this.props;

    if(!data) {
      return <div></div>
    }

    data = [...data]

    const dates = data.shift();
    const x_axis = dates.map((date, i) => {
      if(i == 0) return
      const parsed_date = date.replace('/', '/20');
      return new moment(parsed_date, 'M/YYYY').toDate()
    })

    const values = [];

    const lines = data.map((datum, i) => {
      const label = datum[0]
      const line_data = datum.map((y, j) => {
        if(j < 1) {
          return
        }
        values.push(y)
        return {
          x: x_axis[j],
          y: y
        }
      });
      line_data.shift()

      return (

        <VictoryLine
          style={{
            data: {
              stroke: colors[i],
              strokeWidth: 4
            }
          }}
          key={i}
          label={label}
          padding={100}
          y={(data) => {
            return parseInt(data.y)
          }}
          interpolation="monotone"
          data={line_data}>
        </VictoryLine>
      );
    })

    const padding = {
      top: 50,
      right: 120,
      bottom: 50,
      left: 50
    }

    // shift blank first row/column
    x_axis.shift()

    // calculate height and try to keep same ratio
    let height = width / 2.56;

    // min-height for graph
    if(height < 300) {
      height = 300
    }

    return (
      <VictoryChart
        height={height}
        width={width}
        padding={padding}
      >
        {lines}
        <VictoryAxis
          scale="time"
          tickFormat={(date) => new moment(date).format('MM/YYYY')}
          >
        </VictoryAxis>
      </VictoryChart>
    )
  }
}
