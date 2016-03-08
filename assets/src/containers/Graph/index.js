import React, {Component} from 'react'
import styles from './style.scss'
import LineGraph from '../../components/Graphs/LineGraph.js'
import DataTable from '../../components/Table/DataTable.js'
import PieChart from '../../components/Graphs/PieChart.js'
import classnames from 'classnames'

export default class Graph extends Component {
  constructor(props) {
    super(props)
  }
  set_type(e) {
    e.preventDefault()
    this.props.save_type(
      e.target.getAttribute('data-type'),
      this.props
    )
  }
  render() {

    const {
      graphs,
      id
    } = this.props

    let filtered_data = graphs[id];

    if(!filtered_data) {
      return <div>Loading</div>
    }

    let {
      data,
      type
    } = filtered_data;

    if(!type) {
      type = 'line'
    }

    if(document.querySelector('.values')) {
      const parent =
        document.querySelector(`.values .acf-chart[data-id="${id}"]`)
    } else {
      const parent = document.querySelector(`.acf-chart[data-id="${id}"]`)
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
  static propTypes = {
    store: React.PropTypes.object
  }
}
