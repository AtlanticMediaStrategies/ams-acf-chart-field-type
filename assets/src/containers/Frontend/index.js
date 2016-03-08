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
    this.props.push_id(id)
    this.props.init_data(id)
    this.setState({id})

  }

  render() {
    if(!this.state.id || !this.props.graphs) {
      return (
        <div>loading</div>
      )
    }
    return (
      <Graph {...this.props} id={this.state.id}/>
    )
  }
}
