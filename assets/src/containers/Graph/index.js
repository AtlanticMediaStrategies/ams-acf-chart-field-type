import React, {Component} from 'react'
import LineGraph from '../../components/Graphs/LineGraph.js'
import DataTable from '../../components/Table/DataTable.js'
import PieChart from '../../components/Graphs/PieChart.js'
import BarChart from '../../components/Graphs/BarChart.js'

import classnames from 'classnames'

export default class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 1280
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
  }

  render() {
    const {
      data,
      type,
      colors,
      active,
      currentColumn,
      id
    } = this.props.graph

    const filtered_data = data.filter((dat, i) => active[i] === true)

    const chartProps = {
      width: this.state.width,
      colors,
      data: filtered_data
    }

    if(type == 'pie') {
      Object.assign(chartProps, { currentColumn } )
      var graph = <PieChart {...chartProps}></PieChart>
    } else if (type == 'bar') {
      var graph = <BarChart {...chartProps}></BarChart>
    } else {
      var graph = <LineGraph {...chartProps}></LineGraph>
    }

    return  (
      <div>
        {graph}
      </div>
    )
  }
}
