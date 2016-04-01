import React, { Component } from 'react';
import { VictoryPie } from 'victory';

/**
 *  Wrapper around VictoryPie
 */
export default class PieChart extends Component {

  render() {
    const {
      currentColumn,
      colors,
      ready
    } = this.props

    if(!this.props.data) {
      return (
        <div></div>
      )
    }

    // clone array
    const data = [...this.props.data]

    const dates = data.shift()

    // transform data to VictoryPie.data
    const pie_data =
      data
        .map((datum, i) => {
          if(datum === false) {
            return datum
          }
          const x = datum[0]
          const y = ready ? parseInt(datum[currentColumn]) : 90;
          const fill = colors[i + 1]
          return { x , y, fill }
        })
        .filter((datum) => datum != false)

    let width = this.props.width;
    if(width > 800) {
      width = 800
    }

    return (
      <VictoryPie
        animate={{duration: 1200}}
        style={{
          labels: {
            fill: '#FDFDFD'
          }
        }}
        data={pie_data}
        width={width}
      >
      </VictoryPie>
    )
  }
}
