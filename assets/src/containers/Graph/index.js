import React, {Component} from 'react'
import LineGraph from '../../components/Graphs/LineGraph.js'
import DataTable from '../../components/Table/DataTable.js'
import PieChart from '../../components/Graphs/PieChart.js'
import BarChart from '../../components/Graphs/BarChart.js'
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

    // differing parent based on whether in wp-admin or not
    let parent_selector = `.acf-chart[data-id="${id}"]`;
    if(document.querySelector('.values')) {
      parent_selector = `.values ${parent_selector}`
    }

    const parent = document.querySelector(parent_selector);
    let width = parent.offsetWidth
    this.setState({ width })

    const calculateWidth = () => {
      this.setState({width: parent.offsetWidth});
    }

    require(['underscore'], (score) => {
      const underscore = window._ || score;
      window.addEventListener(
        'resize',
        underscore.debounce(calculateWidth, 200)
      )
    })

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
      active_rows
    } = this.props.graph

    const ready = this.state.scrolled && this.state.ready

    const filtered_data = data.map((dat, i) =>  {
      return (active_rows[i] === true) ? dat : false
    });

    const chartProps = {
      width: this.state.width,
      data: filtered_data,
      ready,
      active_rows,
      colors,
      currentColumn,
      x_axis,
      y_axis
    }

    if(type == 'pie') {
      var graph = <PieChart {...chartProps}></PieChart>
    } else if (type == 'bar') {
      var graph = <BarChart {...chartProps}></BarChart>
    } else {
      var graph = <LineGraph {...chartProps}></LineGraph>
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
