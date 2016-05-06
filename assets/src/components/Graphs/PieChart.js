import React, { Component } from 'react';
import { VictoryPie, VictoryChart } from 'victory';
import { Flex, Box } from 'reflexbox'
import Legend from './Legend.js'
import { parse_date } from './utils.js'
import { date_format } from './config.js'
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
      columns_constrained
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

    // sort by index, indexes aren't even duplicated so just sort
    // by lessthan/greaterthan
    const sort_by_num = (one, two) => (one < two) ? -1 : 1

    const pies = active_columns.sort(sort_by_num).map((index) => {
      let pie_data =
        data
          .map((datum, i) => {
            if(datum === false) {
              return datum
            }
            const x = `${datum[index]}%`
            const y = ready ? parseInt(datum[index]) : 90;
            const fill = colors[i + 1]
            return { x , y, fill }
          })
          .filter((datum) => datum != false)

      if(width < 769) {
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

      const pie_width = (width < 728)  ? width : width / 2

      return (
        <Box {...BoxProps}>
          <VictoryPie
            animate={{duration: 1200}}
            width={pie_width}
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
    if(width < 768) {
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
