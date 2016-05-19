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

    let width = this.props.width;
    if(width > 800) {
      width = 800
    }

    const pies = active_columns.sort(sort_by_index).map((index) => {
      let pie_data =
        data
          .map((datum, i) => {
            if(datum === false) {
              return datum
            }
            const x = `${datum[index]}%`
            const y = parseInt(datum[index]);
            const fill = colors[i + 1]
            return { x , y, fill }
          })
          .filter((datum) => datum != false)

      if(bodyWidth < DESKTOP_WIDTH) {
        var BoxProps = {
          col: 12
        }
      } else {
        var BoxProps = {
          auto: true
        }
      }

      const padding = {
        bottom: 0,
        top: 50
      }

      const pie_width = (bodyWidth < DESKTOP_WIDTH )  ? width : width / 2

      return (
        <Box {...BoxProps}>
          <VictoryPie
            width={ pie_width }
            height={ bodyWidth }
            standalone={ true }
            style={{
              labels: {
                fill: '#FDFDFD',
                fontFamily: 'allstate-sans, sans-serif',
                fontSize: 14
              },
            }}
            padding={ padding }
            data={ pie_data }
          />
        <p
          className={ styles.pieLabel }
          style={{textAlign: 'center'}}>
            { processed_dates[index].format(date_format) }
        </p>
        </Box>
      )
    })

    const FlexProps = {}
    if(bodyWidth < DESKTOP_WIDTH ) {
      Object.assign(FlexProps, {wrap: true})
    }

    return (
      <div className="pie">
        <Legend
          data={ data }
          colors={ colors }
        >
        </Legend>
        <Flex {...FlexProps} >
          { pies }
        </Flex>
      </div>
    )
  }
}
