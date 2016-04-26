import React, {Component} from 'react'
import { axis_styles, date_format } from './config.js'
import { parse_date } from './utils.js'
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis
} from 'victory'

import moment from 'moment'
import Vivus from 'vivus'
import ReactDOM from 'react-dom'

export default class LineGraph extends Component {

  constructor(props) {
    super(props)
    this.state = {
      animated: false
    }
  }

  componentWillReceiveProps({ready, disableAnimation}) {
    if(ready === true && disableAnimation !== true) {
      const elm = ReactDOM.findDOMNode(this)
      let biggest = -9999;
      Array.from(elm.querySelectorAll('text[data-reactid*=line-label]')).forEach(label => {
        if(label.getBoundingClientRect().width > biggest) {
          biggest = label.getBoundingClientRect().width
        }
      })
      Object.assign(elm.style, {paddingRight: `${biggest}px`})
      new Vivus(elm)
    }
  }

  render() {
    let {
      data,
      width,
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

    const dates = data.shift();
    const x_values = dates.map(parse_date)

    const lines =
      data
        .map((datum, i) => {
          if(datum === false) {
            return datum
          }
          let line_data;
          line_data = active_columns.map((j) => {
            return {
              x: x_values[j].toDate(),
              y: parseInt(datum[j])
            }
          })

          return (
            <VictoryLine
              style={{
                data: {
                  stroke: colors[i + 1],
                  strokeWidth: 2
                },
                labels: {
                  fontFamily: "allstate-sans, sans-serif",
                  fontSize: 14
                }
              }}
              key={ i }
              label={ (width > 768) ? datum[0] : null }
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

    if(width < 768) {
      Object.assign(chart_padding, {
        right: 32,
        left: 32
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

    return (
      <VictoryChart
        height={height}
        width={width}
        padding={ chart_padding }
      >

        {lines}

        <VictoryAxis
          dependentAxis
          label={y_axis}
          style={ axis_styles }
          padding={ axisPadding }
        >
        </VictoryAxis>


        <VictoryAxis
          scale="time"
          label={ x_axis }
          padding={ axisPadding }
          style={ axis_styles }
          tickFormat={(date, i) => {
            if(width < 768) {
              if(i != 0 && i != 6) {
                return
              }
            }
            return date.format(date_format)}
          }
        >
        </VictoryAxis>
      </VictoryChart>
    )
  }
}
