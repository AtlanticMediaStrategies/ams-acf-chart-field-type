import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import LineGraph from '../../components/Graphs/LineGraph/LineGraph.js'
import DataTable from '../../components/Table/DataTable.js'
import PieChart from '../../components/Graphs/PieChart.js'
import BarChart from '../../components/Graphs/BarChart.js'
import Table from '../../components/Graphs/Table.js'

import Waypoint from 'react-waypoint'
import classnames from 'classnames'


export default class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      scrolled: props.disableAnimation || false,
    }
  }

  /**
   *  Bind resize function for responsive graphs
   */
  componentDidMount() {
    const { id } = this.props;

    const svg = ReactDOM.findDOMNode(this);
    const parent = svg.parentNode;
    const width = parent.offsetWidth;
    this.setState({ width: this.props.width || width })
    setTimeout(() => this.setState({ready: true}), 200)
  }

  scrolled() {
    this.setState({
      scrolled: true
    })
  }

  render() {
    const {
      data,
      type,
      colors,
      currentColumn,
      id,
      x_axis,
      y_axis,
      active_rows,
      active_columns
    } = this.props.graph

    const ready = this.state.scrolled && this.state.ready

    if(!data) {
      return <div></div>
    }

    const filtered_data = data.map((dat, i) =>  {
      return (active_rows[i] === true) ? dat : false
    });

    const chartProps = {
      width: this.state.width,
      data: filtered_data,
      disableAnimation: this.props.disableAnimation,
      ready,
      active_rows,
      colors,
      currentColumn,
      x_axis,
      y_axis,
      active_columns
    }


    if(!active_columns || active_columns.length < 1) {
      return <div>Please specify columns</div>
    }

    if(type === 'pie') {
      var graph =
        <PieChart
          {...chartProps}
        >
        </PieChart>
    } else if (type === 'bar') {
      var graph =
        <BarChart
          {...chartProps}
        >
        </BarChart>
    } else if (type === 'table') {

      var graph =
        <Table
          {...chartProps}
        >
        </Table>
    } else {
      var graph =
        <LineGraph
          {...chartProps}>
        </LineGraph>
    }

    return  (
      <div>
        <Waypoint
          onEnter={this.scrolled.bind(this)}
        />
        {graph}
      </div>
    )
  }
}
