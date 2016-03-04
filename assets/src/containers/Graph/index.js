import React, {Component} from 'react'
import LineGraph from '../../components/Graphs/LineGraph.js'
import DataTable from '../../components/Table/DataTable.js'
import PieChart from '../../components/Graphs/PieChart.js'

export default class Graph extends Component {
  constructor(props) {
    super(props)
  }
  set_type(e) {
    this.props.set_type(
      e.target.getAttribute('data-type'),
      this.props.id
    )
  }
  render() {

    let {
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

    if(type == 'pie') {
      var graph = <PieChart data={data}></PieChart>
    } else {
      var graph = <LineGraph data={data}></LineGraph>
    }

    return  (
      <div>
        <nav>
          <a onClick={this.set_type.bind(this)} data-type="pie">Set to Pie Chart</a>
          <a onClick={this.set_type.bind(this)} data-type="line">Set to Line Chart</a>
        </nav>
        {graph}
        <DataTable data={data}></DataTable>
      </div>
    )
  }
  static propTypes = {
    store: React.PropTypes.object
  }
}
