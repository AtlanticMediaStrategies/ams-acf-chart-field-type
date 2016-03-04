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

    const pie_classes = classnames({
      btn: true,
      ['btn--active']: type === 'pie'
    })

    const line_classes = classnames({
      btn: true,
      ['btn--active']: type === 'line'
    })
    return  (
      <div>
        <h3 for="pie">Chart Type</h3>
        <button
            type="radio"
            className={pie_classes}
            name="pie"
            onClick={this.set_type.bind(this)}
            data-type="pie">
            Pie
        </button>
        <button
          onClick={this.set_type.bind(this)}
          className={line_classes}
          data-type="line">
          line
        </button>
        {graph}
        <DataTable data={data}></DataTable>
      </div>
    )
  }
  static propTypes = {
    store: React.PropTypes.object
  }
}
