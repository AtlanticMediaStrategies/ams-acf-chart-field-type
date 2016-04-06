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
      y_axis,
      ready,
      columns_constrained,
      active_columns
    } = this.props

    if(!data) {
      return <div></div>
    }

    data = [...data]

    const dates = data.shift()

    let bar_data, categories;
    if(active_columns.length === 1) {
      const column = active_column[0]
      bar_data =
        data
          .map((datum, x) => {
            if(datum === false) {
              return datum
            }
            return {
              x: datum[0],
              y: ready ? parseInt(datum[column]) : 0,
              label: datum[currentColumn],
              fill: colors[x + 1]
            }
          })
          .filter((datum) => datum != false)
      categories = data.map((datum) => datum[0])
    } else {
        bar_data =
          data
            .map((datum, i) => {
              if(datum === false) {
                return datum
              }
              return active_columns.map((column, j) => {
                return {
                  x: dates[column],
                  y: parseInt(datum[column]),
                  label: datum[column],
                  fill: colors[i + 1]
                }
              })
            })
            .filter(datum => datum !== false)
      categories = active_columns.map(column => dates[column])
    }
    categories.unshift('');

    return (
      <VictoryChart width={width}>
        <VictoryBar
          animate={{velocity: 0.02}}
          data={bar_data}
        >
        </VictoryBar>

        <VictoryAxis
          label={x_axis}
          tickValues={categories}
        ></VictoryAxis>

        <VictoryAxis
          dependentAxis
          label={y_axis}
        >
        </VictoryAxis>

      </VictoryChart>

    )

  }
}
