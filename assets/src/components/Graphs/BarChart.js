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
    let gutter = 180

    if(bodyWidth < DESKTOP_WIDTH) {
      gutter = 70
    }


    let bar_data, categories, bars, legend, bar_width;

    bar_width = bodyWidth < 768 ? 40 : 80

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

      categories =
        active_columns
          .sort(sort_by_index)
          .map(column => dates[column].format(date_format))

        bar_data =
          data.map((datum, i) => {

            if(datum === false) {
              return datum
            }
            return active_columns
              .sort(sort_by_index)
              .map((column, j) => {

                const val = parseInt(datum[column])

                return {
                  x: j + 1,
                  y: val,
                  label: `${val}%`,
                  fill: colors[i + 1]
                }
              })
          })
          .filter(datum => datum !== false)


      const multiple_bars = bar_data.map((data, i) => {
        return (
          <VictoryBar
            key={i}
            style={ bar_styles }
            labelComponent={ <VictoryLabel dy={1.5} /> }
            data={ data }
          >
          </VictoryBar>
        )
      })

      bars =
        <VictoryGroup
          width={width}
          offset={bar_width + 15}
          style={{
            data: {
              width: bar_width
            }
          }}
        >
          { multiple_bars }
        </VictoryGroup>
    }

    const bar_axis_styles = Object.assign({}, axis_styles, {
      grid: {
        strokeWidth: 0
      }
    })

    const height = (bodyWidth < 1025) ? 400 : 600
    const x_axis_label = (bodyWidth < 1025) ? '' : x_axis
    const bar_col = (bodyWidth < 1025) ? 12 : 12;
    const legend_col = 12

    return (
      <div className="bar">
        <Flex wrap={ true }>
          <Box col={ 12 } style={{maxWidth: '45em'}}>
            <VictoryChart
              width={ width }
              height={ height }
              domainPadding={{ x: gutter }}
            >
              <VictoryAxis
                label={ x_axis_label }
                style={ bar_axis_styles }
                tickValues={ categories }
                axisLabelComponent={ <VictoryLabel lineHeight={2} />}
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
          <Box col={12}>
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
