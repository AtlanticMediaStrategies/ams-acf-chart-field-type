import React, { Component } from 'react';
import {
  VictoryBar,
  VictoryAxis,
  VictoryChart
} from 'victory';

export default class BarChart extends Component {

  static propTypes = {
    data: React.PropTypes.array,
    width: React.PropTypes.number
  }

  render() {
    let {
      data,
      width,
      colors,
      currentColumn,
      x_axis,
      y_axis
    } = this.props

    if(!data) {
      return <div></div>
    }

    data = [...data]

    const dates = data.shift()

    const bar_data = data.map((datum, x) => {
      return {
        x: x + 2,
        y: parseInt(datum[currentColumn]),
        label: datum[currentColumn],
        fill: colors[x]
      }
    })

    const categories = data.map((datum) => datum[0])
    categories.unshift('');
    categories.unshift('');

    return (
      <VictoryChart width={width}>
        <VictoryBar
          data={bar_data}>
        </VictoryBar>

        <VictoryAxis
          label={x_axis}
          tickValues={categories}>
        </VictoryAxis>

        <VictoryAxis
          dependentAxis
          label={y_axis}>
        </VictoryAxis>

      </VictoryChart>
    )

  }
}
