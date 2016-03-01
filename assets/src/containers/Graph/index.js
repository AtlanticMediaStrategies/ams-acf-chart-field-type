import React, {Component} from 'react'
import LineGraph from '../../components/Graphs/LineGraph.js'

export default class Graph extends Component {
  constructor(props) {
    super(props)
  }
  render() {

    const {
      data
    } = this.props

    return (
      <div>Graph Container</div>
    )
  }
  static propTypes = {
    store: React.PropTypes.object
  }
}
