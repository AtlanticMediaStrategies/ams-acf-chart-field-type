import React, { Component } from 'react';
import { VictoryPie } from 'victory';

/**
 *  Wrapper around VictoryPie
 */
export default class PieChart extends Component {

  constructor(props) {
    super(props)
    this.state = {
      animated: false
    }
  }

  componentDidMount() {
    setTimeout(() => this.setState({animated: true}), 800)
  }

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
    const pie_data =
      data
        .map((datum, i) => {
          if(datum === false) {
            return datum
          }
          const x = datum[0]
          const y =
            this.state.animated ? parseInt(datum[currentColumn]) : 90;
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
