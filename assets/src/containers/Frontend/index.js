import React, {Component} from 'react'
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actionCreators from '../../actions/app.js';

import Graph from '../Graph';

/* components */
@connect(
  state => state.app,
  dispatch => bindActionCreators(actionCreators, dispatch)
)
export default class Frontend extends Component {

  constructor(props) {
    super(props)
    this.state = {
      id: null
    }
  }

  componentDidMount() {
    const section = ReactDOM.findDOMNode(this)
    let parent = section.parentNode;
    while(!parent.classList.contains('acf-chart')) {
      parent = parent.parentNode;
    }
    const id = parent.getAttribute('data-id')
    const name = parent.getAttribute('data-name')
    this.props.init_data(id, name)
    this.setState({id, name})

  }

  render() {
    if(!this.state.id || !this.props.graphs) {
      return (
        <div>loading</div>
      )
    }

    const post_graphs  = this.props.graphs[this.state.id]
    if(!post_graphs || ! post_graphs[this.state.name])  {
      return (
        <div>Loading</div>
      )
    }
    const {
      type,
      colors,
      currentColumn,
      data
    } = post_graphs[this.state.name]

    return (
      <Graph
        type={type}
        colors={colors}
        data={data}
        currentColumn={currentColumn}
        id={this.state.id}
      />
    )
  }
}
