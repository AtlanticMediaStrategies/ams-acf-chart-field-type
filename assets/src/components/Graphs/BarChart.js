import React, { Component } from 'react'
import { axis_styles, y_axis_styles, DESKTOP_WIDTH } from './config.js'
import Legend from './Legend.js'
import { parse_date, sort_by_index } from './utils.js'
import {Flex, Box} from 'reflexbox'
import { date_format } from './config.js'
import styles from './style.scss'
import ReactDOM from 'react-dom'

import {
  VictoryBar,
  VictoryAxis,
  VictoryGroup,
  VictoryChart,
  VictoryStack,
  VictoryLabel,
} from 'victory';

export default class BarChart extends Component {

  static propTypes = {
    data: React.PropTypes.array
  }

  componentDidMount() {
    const elm = ReactDOM.findDOMNode(this)
    const svg = elm.querySelector('svg')

    if('ActiveXObject' in window) { // is window
      Object.assign(svg.style, {
        minHeight: '25em'
      })
    }

  }

  render() {
    let {
      data,
      colors,
      currentColumn,
      x_axis,
      y_axis,
      columns_constrained,
      active_columns,
      width,
      bodyWidth
    } = this.props

    if(!data) {
      return <div></div>
    }

    data = [...data]

    const dates =
      data
        .shift()
        .map( parse_date )

    const fontSize = (bodyWidth < DESKTOP_WIDTH) ? 12 : 20

    const bar_styles = {
      labels: {
        fontFamily: 'allstate-sans, sans-serif',
        fontWeight: 100,
        fontSize: 18,
        stroke: 'none',
        fill: 'white',
        padding: 0,
        fontSize
      }
    }

    const bar_count = data.filter(data => data !== false).length
    let gutter = 120

    if(bodyWidth < DESKTOP_WIDTH) {
      gutter = 70
    }


    let bar_width = ( width / bar_count ) - gutter

    if(bar_width > 120) {
      bar_width = 120
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
            const val = parseInt(datum[column])
            return {
              x: datum[0],
              y: val,
              width: bar_width,
              label: (val < 8) ? '' : `${val}%`,
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
          labelComponent={ <VictoryLabel verticalAnchor="bottom" /> }
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
              return active_columns.sort(sort_by_index).map((column, j) => {

                const val = parseInt(datum[column])

                return {
                  x: j + 1,
                  y: val,
                  label: (val < 8) ? '' : `${val}%`,
                  width: bar_width,
                  fill: colors[i + 1]
                }
              })
            })
            .filter(datum => datum !== false)

      categories =
        active_columns
          .sort(sort_by_index)
          .map(column => dates[column].format(date_format))

      const multiple_bars = bar_data.map((data, i) => {
        return (
          <VictoryBar
            key={i}
            style={ bar_styles }
            labelComponent={ <VictoryLabel verticalAnchor="bottom" dy={0.5} /> }
            data={ data }
          >
          </VictoryBar>
        )
      })

      bars = <VictoryStack width={width}>{ multiple_bars }</VictoryStack>
    }


    const bar_axis_styles = Object.assign({}, axis_styles, {
      grid: {
        strokeWidth: 0
      }
    })

    const wrap = bodyWidth < 1025;
    const height = (bodyWidth < 1025) ? 400 : 600
    const x_axis_label = (bodyWidth < 1025) ? '' : x_axis
    const bar_col = (bodyWidth < 1025) ? 12 : 12;
    const legend_col = (bodyWidth < 1025) ? 12 : 3
    const legend_order = (bodyWidth < 1025 ) ? 0 : 2

    return (
      <div className="bar">
        <Flex wrap={ wrap }>
          <Box auto={true} order={1} lg={12}>
            <VictoryChart
              width={ width }
              height={ height }
              domainPadding={{ x: gutter }}
            >
              <VictoryAxis
                label={ x_axis_label }
                style={ bar_axis_styles }
                axisLabelComponent={ <VictoryLabel lineHeight={2} />}
                tickValues={ categories }
                    tickFormat={(cat, i) => {
                  return categories[cat - 1]
                }}
              ></VictoryAxis>

              <VictoryAxis
                dependentAxis
                standalone={ false }
                axisLabelComponent={ <VictoryLabel lineHeight={3} />}
                tickCount={3}
                  style={ y_axis_styles }
                label={ y_axis }
                tickFormat={(perc) => `${perc}%`}
              >
              </VictoryAxis>
              { bars }
            </VictoryChart>
            <p className="mobileBarChartAxis"> { x_axis }</p>
          </Box>
          <Box col={ legend_col } order={ legend_order }>
            <Legend
              data={data}
              colors={colors}
            ></Legend>
          </Box>
        </Flex>
      </div>

    )

  }
}
