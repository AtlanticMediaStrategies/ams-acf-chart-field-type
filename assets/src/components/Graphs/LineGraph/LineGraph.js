import React, { Component } from 'react'

import {
  y_axis_styles,
  axis_styles,
  date_format,
  DESKTOP_WIDTH
} from '../config.js'

import { parse_date, sort_by_index } from '../utils.js'

import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryLabel
} from 'victory'

import LineSegment from './LineSegment.js'
import Tooltip from './Tooltip.js'

import moment from 'moment'
import ReactDOM from 'react-dom'
import Legend from '../Legend.js'
import Filters from './Filters.js'
import styles from './line-graph.scss'
import numeral from 'numeral'

export default class LineGraph extends Component {

  constructor(props) {
    super(props)
    this.state = {
      tooltip_coords: null,
      tooltip_active: false,
      tooltip_value: null
    }

    this.removeTooltip = this.removeTooltip.bind(this)
    this.setTooltip = this.setTooltip.bind(this)
  }

  componentWillReceiveProps() {
    const elm = ReactDOM.findDOMNode(this)
    const svg = elm.querySelector('svg')

    if(!svg) {
      return true
    }

    if('ActiveXObject' in window) { // is IE, make sure it has a min-height
      Object.assign(svg.style, {
        minHeight: '25em'
      })
    }
  }

  /**
   * Sets active line
   *
   * @param active_line {integer} the index of the line in the data
   */
  setTooltip(tooltip_value, { clientX, clientY }) {
    const elm = ReactDOM.findDOMNode(this)
    const { left, top, height } = elm.getBoundingClientRect()

    this.setState({
      tooltip_coords: [clientX - left, clientY - top + 81],
      tooltip_active: true,
      tooltip_value,
    })
  }

  /**
   *  Removed tooltip
   */
  removeTooltip() {
    this.setState({
      tooltip_active: false
    })
  }

  render() {
    let {
      data,
      width,
      bodyWidth,
      colors,
      x_axis,
      y_axis,
      ready,
      active_columns
    } = this.props

    if(!data || !width) {
      return <div></div>
    }

    data = [...data]

    const x_values = data.shift().map(parse_date)

    const { active_line } = this.state;

    const lines =
      data
        .map((datum, i) => {
          if(datum === false) {
            return datum
          }
          let line_data;
          line_data = active_columns.map((j, x) => {
            return {
              x,
              y: parseInt(datum[j])
            }
          })

          return (
            <VictoryLine
              style={{
                data: {
                  stroke: colors[i + 1],
                  strokeWidth: 4
                },
                labels: {
                  fontFamily: "allstate-sans, sans-serif",
                  fontSize: 14,
                  textTransform: 'uppercase'
                }
              }}
              dataComponent={ <LineSegment
                               order = { i }
                               disableAnimation={ this.props.disableAnimation }
                               removeTooltip={ this.removeTooltip }
                               setActiveLine={ this.setTooltip } />
                            }
              key={ i }
              interpolation='cardinal'
              padding={ 100 }
              data={ line_data }>
            </VictoryLine>
          );
      })
      .filter((datum) => datum !== false)

    const chart_padding = {
      top: 50,
      right: 0, // make this dynamic
      bottom: 50,
      left: 50
    }

    if(width <= 768) {
      Object.assign(chart_padding, {
        right: 32,
        left: 48
      })
    }

    // shift blank first row/column
    x_values.shift()

    // calculate height and try to keep same ratio
    let height = width * .721088435

    // min-height for graph
    if(height < 300) {
      height = 300
    }

    const axisPadding = {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    }

    const x_axis_styles = Object.assign(axis_styles, {
      ticks: {
        strokeWidth: 0
      }
    })

    const actives = active_columns.sort(sort_by_index)
    const values = active_columns.map((val, i) => i)

    const line_y_axis_styles = (bodyWidth < DESKTOP_WIDTH) ?
      Object.assign({}, x_axis_styles, {grid: {strokeWidth: 0}}) :
      x_axis_styles

    return (
      <div className="line">
        <div className="line__container">
          <Tooltip
              coords={this.state.tooltip_coords}
              active={this.state.tooltip_active}
              value={this.state.tooltip_value} />

          <Legend
            data={data}
            colors={colors}></Legend>

          <VictoryChart
            height={height}
            width={width}
            padding={ chart_padding }
          >
            <VictoryAxis
              dependentAxis
              label={y_axis}
              style={ axis_styles }
              padding={ axisPadding }
              axisLabelComponent={ <VictoryLabel lineHeight={4} />}
              tickCount={4}
              tickFormat={(val) => (val <= 100) ? `${val}%` : numeral(val).format('0,0') }
            >
            </VictoryAxis>

            <VictoryAxis
              label={ x_axis }
              padding={ axisPadding }
              style={ line_y_axis_styles }
              axisLabelComponent={ <VictoryLabel lineHeight={4} />}
              tickValues={ values }
              tickFormat={(val, i) => {
                // don't show tick values on mobile
                if(bodyWidth < DESKTOP_WIDTH) {
                  if(i != 0 && i != values.length - 1) {
                    return
                  }
                }
                // only show every other tick on desktop
                if(data.find(exists => exists).length > 14) {
                  if(i % 2 == 1){
                    return
                  }
                }
                const date = x_values[actives[i]]
                return moment(date).format(date_format)
              }}
            >
            </VictoryAxis>
            {lines}
          </VictoryChart>
        </div>
      </div>
    )
  }
}
