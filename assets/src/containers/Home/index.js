import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actionCreators from '../../actions/app.js';


import DocumentMeta from 'react-document-meta';
import Dropzone from 'react-dropzone';
import csv from 'csv';
import styles from './home.scss';
import request from 'reqwest-without-xhr2';

import Graph from '../Graph';

/* components */
@connect(
  state => state.app,
  dispatch => bindActionCreators(actionCreators, dispatch)
)
export class Home extends Component {
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

  /**
   *  @param files {array}
   */
  handleFiles(files) {
    const reader = new FileReader()
    reader.onload = () => {
      csv.parse(reader.result, (err, res) => {
        if(err)
          throw err
        request({
          url: `/acf-chart/update/${this.state.id}`,
          method: 'POST',
          data: {
            json: JSON.stringify(res)
          }
        })
        .then(res => {
          this.props.set_data(res)
        })
        .catch(err => {
          console.log(err)
        })
      })
    }
    const file = files.shift()
    reader.readAsText(file)
  }

  toggleEdit(e) {
    e.preventDefault()
    this.props.toggle_edit()
  }

  render() {

    const {
      data,
      edit
    } = this.props

    const main = data && !edit ? (
        <Graph {...this.props} id={this.state.id}></Graph>
      ) : (
        <Dropzone onDrop={this.handleFiles.bind(this)} accept="text/csv">
          <div className="drop-text">
            Drop csv files here or click to trigger form.
          </div>
        </Dropzone>
      )


    return (
      <section>
        {main}
        <button onClick={this.toggleEdit.bind(this)}>Edit</button>
      </section>
    );
  }
}
