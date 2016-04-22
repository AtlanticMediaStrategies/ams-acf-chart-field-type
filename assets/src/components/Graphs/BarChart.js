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


    const bar_count = data.filter(data => data !== false).length
    const gutter = 120
    let bar_width = ( width / bar_count ) - gutter

    if(bar_width > 120) {
      bar_width = 120
    }

    if(bar_width < 80) {
      bar_width = 80
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
              width: bar_width,
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
                  width: bar_width,
                  fill: colors[i + 1],
                  strokeWidth: 1,
                  stroke: '#FAFAFA'
                }
              })
            })
            .filter(datum => datum !== false)
      categories = active_columns.map(column => dates[column])

      console.log(bar_data)

      const multiple_bars = bar_data.map((data, i) => {
        return (
          <VictoryBar
            key={i}
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
        domainPadding={{ x: gutter }}
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
