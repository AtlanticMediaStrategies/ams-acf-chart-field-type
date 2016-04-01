import React, { Component } from 'react';
import {
  VictoryBar,
  VictoryAxis,
  VictoryChart
} from 'victory';

export default class BarChart extends Component {

  static propTypes = {
    data: React.PropTypes.array,
    width: React.PropTypes.number
  }

  constructor(props) {
    super(props)
    this.state = {
      animated: false
    }
  }

  componentDidMount() {
    setTimeout(() => this.setState({animated: true}), 200)
  }

  render() {
    let {
      data,
      width,
      colors,
      currentColumn,
      x_axis,
      y_axis
    } = this.props

    if(!data) {
      return <div></div>
    }

    data = [...data]

    const dates = data.shift()

    const bar_data =
      data
        .map((datum, x) => {
          if(datum === false) {
            return datum
          }
          return {
            x: x + 2,
            y: this.state.animated ? parseInt(datum[currentColumn]) : 0,
            label: datum[currentColumn],
            fill: colors[x + 1]
          }
        })
        .filter((datum) => datum != false)

    const categories = data.map((datum) => datum[0])
    categories.unshift('');
    categories.unshift('');

    return (
      <VictoryChart width={width}>
        <VictoryBar
          animate={{velocity: 0.02}}
          data={bar_data}>
        </VictoryBar>

        <VictoryAxis
          label={x_axis}
          tickValues={categories}>
        </VictoryAxis>

        <VictoryAxis
          dependentAxis
          label={y_axis}>
        </VictoryAxis>

      </VictoryChart>
    )

  }
}
