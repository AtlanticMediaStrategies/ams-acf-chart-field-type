import React, {Component} from 'react'
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis
} from 'victory'

import moment from 'moment'

export default class LineGraph extends Component {
  render() {
    const {
      data
    } = this.props;

    const keys = data.shift();

    const colors = [
      "#9C9C9C",
      "#E6AC00",
      "#006aab",
      "#fe2f07",
      "#5179FF",
      "#E92771",
      "#22A597",
      "#FF7F50",
      "#008848",
      "#971100",
      "#00C9E3",
      "#BD10E0",
      "#5ace45",
      "#5c0f9a",
      "#8BC4FF",
      "#FF00A2"
    ];

    const obj = keys.reduce((obj, key, i) => {
      return Object.assign(obj, {
        [key]: []
      });
    }, {});

    const x_axis = []

    let max = -Infinity

    data.forEach((datum, i) => {
      Object.keys(obj).forEach((key, j) => {
        const x = new moment(datum[0], 'YYYY-MM').toDate();
        if(j == 0) {
          x_axis.push(x)
        } else {
          if(datum[j] > max) {
            max = datum[j]
          }
          obj[key].push({
            y: datum[j],
            x: i
          })
        }
      })
    });

    const lines = Object.keys(obj).map((key,i) => {
      if(key === 'date') {
        return
      }
      return (
        <VictoryLine
          style={{
            data: {
              stroke: colors[i],
              strokeWidth: 4
            }
          }}
          interpolation="monotone"
          key={i} data={obj[key]}>

        </VictoryLine>
      )
    })

    const width = document.getElementById('postbox-container-2').offsetWidth

    return (
      <VictoryChart height={500} width={width}>
        {lines}
      </VictoryChart>
    )
  }
}
