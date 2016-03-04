import React, { Component } from 'react';
import { VictoryPie } from 'victory';

export default class PieChart extends Component {
  render() {
    let {
      data
    } = this.props

    if(!data) {
      return <div></div>
    }

    // clone array
    data = [...data]

    const dates = data.shift()

    const pie_data = data.map((datum, i) => {
      const label = datum[0]
      const pie = datum[datum.length - 1] // use most recent data
      console.log(`label: ${label}, data: ${pie}`)
      return {
        x: label,
        y: parseInt(pie)
      }
    })

    return (
      <VictoryPie
        data={pie_data}
      >
      </VictoryPie>
    )
  }
}
