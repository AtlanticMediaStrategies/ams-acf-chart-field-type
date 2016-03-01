import React, {Component} from 'react'
import {
  VictoryChart,
  VictoryLine
} from 'victory'

export default class LineGraph extends Component {
  render() {
    const {
      data
    } = this.props;

    const keys = data.shift();

    const.colors = [
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

    data.forEach((datum, i) => {
      console.log(datum);
    });



    return (
      <VictoryChart>
      </VictoryChart>
    )
  }
}
