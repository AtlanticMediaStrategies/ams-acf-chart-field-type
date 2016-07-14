import React, { Component } from 'react';
import { VictoryPie, VictoryChart } from 'victory';
import { Flex, Box } from 'reflexbox'
import Legend from './Legend.js'
import { parse_date, sort_by_index } from './utils.js'
import { date_format, DESKTOP_WIDTH } from './config.js'
import styles from './style.scss'

/**
 *  Wrapper around VictoryPie
 */
export default class PieChart extends Component {

  render() {

    const {
      currentColumn,
      colors,
      ready,
      active_columns,
      columns_constrained,
      bodyWidth
    } = this.props

    if(!this.props.data) {
      return (
        <div></div>
      )
    }

    // clone array
    const data = [...this.props.data]

    const processed_dates = data.shift().map(parse_date)

    const pie_colors = [];

    let width = this.props.width;
    if(width > 800) {
      width = 800
    }

    const pies = active_columns.sort(sort_by_index).map((index) => {
      const pie_data =
        data
          .map((datum, i) => {
            if(datum === false) {
              return datum
            }
            const x = datum[index] > 15  ? `${datum[index]}%` : ' '
            const y = parseInt(datum[index])
            return { x , y }
          })
          .filter((datum, i) => {
            if(datum !== false) {
              pie_colors.push(colors[i + 1])
            }
            return datum != false
          })

      const padding = {
        bottom: 0,
        top: 50
      }

      const pie_width = (bodyWidth < DESKTOP_WIDTH )  ? width : width / 2

      const height = (bodyWidth < DESKTOP_WIDTH) ? bodyWidth : undefined

      const fontSize = (bodyWidth < DESKTOP_WIDTH) ? 22 : 32

      const perc = (bodyWidth < 769) ? '100%' : `${(1 / active_columns.length) * 100}%`

      return (
        <div className="pie" style={{float: 'left', width: perc}}>
          <VictoryPie
            width={ pie_width }
            height={ height }
            standalone={ true }
            colorScale={ pie_colors }
            style={{
              labels: {
                fill: '#FDFDFD',
                fontFamily: 'allstate-sans, sans-serif',
                fontWeight: 100,
                fontSize
              },
            }}
            padding={ padding }
            data={ pie_data }
          />
          <p
            className="pieLabel"
            style={{textAlign: 'center'}}>
              { processed_dates[index].format(date_format) }
          </p>
        </div>
      )
    })

    const FlexProps = {}
    if(bodyWidth < DESKTOP_WIDTH ) {
      Object.assign(FlexProps, {wrap: true})
    }

    return (
      <div className="pie">
        <div className="pie__container">
          { pies }
        </div>
        <Legend
          data={ data }
          colors={ colors }
        >
        </Legend>
      </div>
    )
  }
}
