import React, { Component } from 'react';
import { VictoryPie } from 'victory';

/**
 *  Wrapper around VictoryPie
 */
export default class PieChart extends Component {
  render() {
    let {
      data,
      currentColumn,
      colors
    } = this.props

    if(!data) {
      return (
        <div></div>
      )
    }

    // clone array
    data = [...data]

    const dates = data.shift()

    // transform data to VictoryPie.data
    const pie_data = data.map((datum, i) => {
      const x = datum[0]
      const y = parseInt(datum[currentColumn])
      const fill = colors[i]
      return { x , y, fill }
    })

    let width = this.props.width;
    if(width > 800) {
      width = 800
    }

    return (
      <VictoryPie
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
