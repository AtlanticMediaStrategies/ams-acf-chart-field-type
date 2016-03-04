import React, {Component} from 'react'
import LineGraph from '../../components/Graphs/LineGraph.js'
import DataTable from '../../components/Table/DataTable.js'
import PieChart from '../../components/Graphs/PieChart.js'

export default class Graph extends Component {
  constructor(props) {
    super(props)
  }
  render() {

    let {
      data,
      id
    } = this.props

    let filtered_data = data[id];

    return (
      <div>
        <PieChart data={filtered_data}></PieChart>
        <DataTable data={filtered_data}></DataTable>
      </div>
    )
  }
  static propTypes = {
    store: React.PropTypes.object
  }
}
