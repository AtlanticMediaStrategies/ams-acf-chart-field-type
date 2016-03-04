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
      data
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

    const colors = [
      "#008848",
      "#971100",
      "#9C9C9C",
      "#E6AC00",
      "#5179FF",
      "#E92771",
      "#22A597",
      "#FF7F50",
      "#008848",
      "#971100",
      "#00C9E3",
      "#BD10E0",
      "#5ace45",
      "#5c0f9a",
      "#8BC4FF",
      "#FF00A2"
    ];

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

    const max = Math.max(...values)
    const min = Math.min(...values)

    const width = document.getElementById('postbox-container-2').offsetWidth

    x_axis.shift()

    return (
      <VictoryChart
        height={500}
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
