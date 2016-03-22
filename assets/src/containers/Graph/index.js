import React, {Component} from 'react'
import styles from './style.scss'
import LineGraph from '../../components/Graphs/LineGraph.js'
import DataTable from '../../components/Table/DataTable.js'
import PieChart from '../../components/Graphs/PieChart.js'
import classnames from 'classnames'


export default class Graph extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: 1280
    }
  }

  componentDidMount() {

    const {id} = this.props;

    let parent;
    if(document.querySelector('.values')) {
      parent =
        document.querySelector(`.values .acf-chart[data-id="${id}"]`)
    } else {
      parent = document.querySelector(`.acf-chart[data-id="${id}"]`)
    }
    let width = parent.offsetWidth;
    this.setState({width})

    const calculateWidth = () => {
      this.setState({width: parent.offsetWidth});
    }

    window.addEventListener('resize' , _.debounce(calculateWidth, 200));

  }

  render() {
    const {
      data,
      type,
      id
    } = this.props


    if(type == 'pie') {
      var graph =
        <PieChart
          width={this.state.width}
          data={data}>
        </PieChart>
    } else {
      var graph =
        <LineGraph
          width={this.state.width}
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
