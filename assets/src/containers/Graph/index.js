import React, {Component} from 'react'
import LineGraph from '../../components/Graphs/LineGraph.js'
import DataTable from '../../components/Table/DataTable.js'

export default class Graph extends Component {
  constructor(props) {
    super(props)
  }
  render() {

    const {
      data
    } = this.props

    return (
      <div>
        <LineGraph data={data}></LineGraph>
        <DataTable data={data}></DataTable>
      </div>
    )
  }
  static propTypes = {
    store: React.PropTypes.object
  }
}
