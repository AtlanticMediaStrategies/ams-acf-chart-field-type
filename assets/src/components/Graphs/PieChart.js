import React, { Component } from 'react';
import { VictoryPie, VictoryChart } from 'victory';
import { Flex, Box } from 'reflexbox'

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

    const dates = data.shift()

    let width = this.props.width;
    if(width > 800) {
      width = 800
    }

    if(!columns_constrained) {

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
    } else {
      const pies = active_columns.map((index) => {
        let pie_data =
          data
            .map((datum, i) => {
              if(datum === false) {
                return datum
              }
              const x = datum[0]
              const y = ready ? parseInt(datum[index]) : 90;
              const fill = colors[i + 1]
              return { x , y, fill }
            })
            .filter((datum) => datum != false)

        return (
          <Box col="6">
            <VictoryPie
              animate={{duration: 1200}}
              width={(width / 2) - 20}
              style={{
                labels: {
                  fill: '#FDFDFD'
                }
              }}
              data={pie_data}
            />
            <h1 style={{textAlign: 'center'}}>{dates[index]}</h1>
          </Box>
        )
      });

      return (
        <Flex wrap={true}>
          {pies}
        </Flex>
      )
    }
  }
}
