import React, { Component } from 'react'
import { axis_styles, y_axis_styles } from './config.js'
import Legend from './Legend.js'
import { parse_date } from './utils.js'
import {Flex, Box} from 'reflexbox'
import { date_format } from './config.js'

import {
  VictoryBar,
  VictoryAxis,
  VictoryGroup,
  VictoryChart,
  VictoryStack
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

    const dates = data.shift().map( parse_date )

    const bar_styles = {
      labels: {
        fontFamily: 'allstate-sans, sans-serif',
        stroke: 'none',
        fill: 'white',
        transform: 'translateY(20px)'
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

    if(width < 768) {
      bar_width = 32
    }

    let bar_data, categories, bars, legend;
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
              label: `${datum[column]}%`,
              fill: colors[x + 1]
            }
          })
          .filter((datum) => datum != false)
      categories =
        data
          .map((datum) => datum[0])
          .filter((datum) => typeof datum !== 'undefined')

      bars = (
        <VictoryBar
          style={ bar_styles }
          animate={{
            onEnter: {
              before: () => {
                return {
                  y: 0
                }
              }
            }
          }}
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
              return active_columns.sort().map((column, j) => {
                return {
                  x: j + 1,
                  y: parseInt(datum[column]),
                  label: `${datum[column]}%`,
                  width: bar_width,
                  fill: colors[i + 1]
                }
              })
            })
            .filter(datum => datum !== false)

      categories =
        active_columns
          .sort()
          .map(column => dates[column].format(date_format))

      const multiple_bars = bar_data.map((data, i) => {
        return (
          <VictoryBar
            key={i}
            style={ bar_styles }
            data={ data }
          >
          </VictoryBar>
        )
      })

      bars = <VictoryStack width={width}>{ multiple_bars }</VictoryStack>

      const legend_col = (width < 768) ? 12 : 4

      legend = (
        <Box col={legend_col}>
          <Legend
            data={data}
            colors={colors}
          ></Legend>
        </Box>
      )
    }



    const wrap = width < 768;
    const height = (width < 768) ? 400 : 600

    return (
      <div>
        <Flex wrap={wrap}>
          <Box auto={true} lg={12}>
            <VictoryChart
              width={width}
              height={ height }
              domainPadding={{ x: gutter }}
            >
              <VictoryAxis
                label={ x_axis }
                style={ axis_styles }
                tickValues={ categories }
                tickFormat={(cat, i) => {
                  return categories[cat - 1]
                }}

              ></VictoryAxis>

              <VictoryAxis
                dependentAxis
                tickCount={3}
                style={ y_axis_styles }
                label={ y_axis }
                tickFormat={(perc) => `${perc}%`}
              >
              </VictoryAxis>

              { bars }

            </VictoryChart>
          </Box>
          { legend }
        </Flex>
      </div>

    )

  }
}
