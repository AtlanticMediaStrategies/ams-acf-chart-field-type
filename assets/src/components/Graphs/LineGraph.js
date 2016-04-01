import React, {Component} from 'react'
import {
  VictoryChart,
  VictoryLine,
  VictoryAnimation,
  VictoryAxis
} from 'victory'

import moment from 'moment'

export default class LineGraph extends Component {

  constructor(props) {
    super(props)
    this.state = {
      animated: false
    }
  }

  componentDidMount() {
    setTimeout(() => this.setState({animated: true}), 200)
  }

  render() {
    let {
      data,
      width,
      colors,
      x_axis,
      y_axis
    } = this.props;

    if(!data) {
      return <div></div>
    }

    data = [...data]

    const dates = data.shift();
    const x_values = dates.map((date, i) => {
      if(i == 0) return
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
          const line_data = datum.map((y, j) => {
            if(j < 1) {
              return
            }
            return {
              x: x_values[j],
              y
            }
          });
          line_data.shift() // shift off label

          const translate = this.state.animated ? '0': '100%'
          const opacity = this.state.animated ? 1 : 0;

          return (
            <VictoryLine
              style={{
                data: {
                  stroke: colors[i + 1],
                  strokeWidth: 4,
                  transition: 'all 0.8s ease',
                  transform: `translateY(${translate})` ,
                  opacity
                }
              }}
              key={i}
              label={label}
              interpolation='monotone'
              padding={100}
              y={(data) => {
                return parseInt(data.y)
              }}
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

    return (
      <VictoryChart
        height={height}
        width={width}
        padding={padding}
      >
        {lines}
        <VictoryAxis
          dependentAxis
          label={y_axis}
        >
        </VictoryAxis>
        <VictoryAxis
          scale="time"
          label={x_axis}
          tickFormat={(date) => new moment(date).format('MM/YYYY')}
          >
        </VictoryAxis>
      </VictoryChart>
    )
  }
}
