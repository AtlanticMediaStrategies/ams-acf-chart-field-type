import React, { Component } from 'react';
import { axis_styles } from './config.js';
import {
  VictoryBar,
  VictoryAxis,
  VictoryGroup,
  VictoryChart
} from 'victory';

export default class BarChart extends Component {

  static propTypes = {
    data: React.PropTypes.array
  }

  render() {
    let {
      data,
      colors,
      currentColumn,
      x_axis,
      y_axis,
      ready,
      columns_constrained,
      active_columns,
      width
    } = this.props

    if(!data) {
      return <div></div>
    }

    data = [...data]

    const dates = data.shift()

    const bar_styles = {
      labels: {
        fontFamily: 'allstate-sans, sans-serif'
      }
    }

    let bar_data, categories, bars;
    if(active_columns.length === 1) {
      const column = active_columns[0]
      bar_data =
        data
          .map((datum, x) => {
            if(datum === false) {
              return datum
            }
            return {
              x: datum[0],
              y: parseInt(datum[column]),
              label: datum[column],
              fill: colors[x + 1],
              width: 28,
            }
          })
          .filter((datum) => datum != false)
      categories =
        data
          .map((datum) => datum[0])
          .filter((datum) => typeof datum !== 'undefined')

      bars = (
        <VictoryBar
          animate={{velocity: 0.02}}
          domainPadding={18}
          style={ bar_styles }
          data={bar_data}
        >
        </VictoryBar>
      )

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
                  width: 20,
                  fill: colors[i + 1],
                  strokeWidth: 1,
                  stroke: '#FAFAFA'
                }
              })
            })
            .filter(datum => datum !== false)
      categories = active_columns.map(column => dates[column])

      const multiple_bars = bar_data.map((data, i) => {
        return (
          <VictoryBar
            animate={{velocity: 0.02}}
            key={i}
            domainPadding={18}
            style={ bar_styles }
            data={data}
          >
          </VictoryBar>
        )
      })
      bars = <VictoryGroup>{ multiple_bars }</VictoryGroup>
    }

    return (
      <VictoryChart
        width={width}
        domainPadding={{x: 32}}
      >

        { bars }

        <VictoryAxis
          label={ x_axis }
          style={ axis_styles }
          tickValues={ categories }
        ></VictoryAxis>

        <VictoryAxis
          dependentAxis
          style={ axis_styles }
          label={ y_axis }
        >
        </VictoryAxis>

      </VictoryChart>

    )

  }
}
