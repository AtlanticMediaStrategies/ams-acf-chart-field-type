import React, {Component} from 'react'
import LineGraph from '../../components/Graphs/LineGraph.js'
import DataTable from '../../components/Table/DataTable.js'

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
        <LineGraph data={filtered_data}></LineGraph>
        <DataTable data={filtered_data}></DataTable>
      </div>
    )
  }
  static propTypes = {
    store: React.PropTypes.object
  }
}
