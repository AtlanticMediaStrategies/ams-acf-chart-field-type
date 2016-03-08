import React, {Component} from 'react'
import styles from './style.scss'
import LineGraph from '../../components/Graphs/LineGraph.js'
import DataTable from '../../components/Table/DataTable.js'
import PieChart from '../../components/Graphs/PieChart.js'
import classnames from 'classnames'


export default class Graph extends Component {
  render() {

    const {
      data,
      type,
      id
    } = this.props

    let parent;
    if(document.querySelector('.values')) {
      parent =
        document.querySelector(`.values .acf-chart[data-id="${id}"]`)
    } else {
      parent = document.querySelector(`.acf-chart[data-id="${id}"]`)
    }
    const width = parent.offsetWidth;

    if(type == 'pie') {
      var graph =
        <PieChart
          width={width}
          data={data}>
        </PieChart>
    } else {
      var graph =
        <LineGraph
          width={width}
          data={data}>
        </LineGraph>
    }

    return  (
      <div>
        {graph}
      </div>
    )
  }
}
