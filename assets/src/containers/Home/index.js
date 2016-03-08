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
import classnames from 'classnames';
import DataTable from '../../components/Table/DataTable.js'

import Graph from '../Graph';

/**
 *  Home Component
 *
 *  Houses Graphs/DataTable/Controls if not in edit state
 *         Upload component if in edit state
 */
@connect(
  state => state.app,
  dispatch => bindActionCreators(actionCreators, dispatch)
)
export class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: null,
      edit: false
    }
  }

  /**
   *  Calculate which graph to pull in
   */
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

  /**
   *  @param files {array}
   */
  handleFiles(files) {
    const reader = new FileReader()
    reader.onload = () => {
      csv.parse(reader.result, (err, res) => {
        if(err)
          throw err
        const json = JSON.stringify({
          data: res,
          type: 'line'
        })

        request({
          url: `/acf-chart/update/${this.state.id}/${this.state.name}/`,
          method: 'POST',
          data: {
            json
          }
        })
        .then(res => {
          this.props.set_data(res, this.state.id)
        })
        .catch(err => {
          console.log(err)
        })
      })
    }
    const file = files.shift()
    reader.readAsText(file)
  }

  /**
   *  Manages edit function
   */
  toggleEdit(e) {
    e.preventDefault()
    this.setState({
      edit: this.state.edit
    })
  }

  /**
   *  Maps redux set_type action
   */
  set_type(e) {
    e.preventDefault()
    this.props.save_type(
      e.target.getAttribute('data-type'),
      this.state.id,
      this.state.name,
      this.props
    )
  }

  render() {

    const { graphs } = this.props

    if(!graphs || !this.state.name) {
      return <div></div>
    }

    const post_graphs = graphs[this.state.id]

    if(!post_graphs || !post_graphs[this.state.name]) {
      return <div>loading</div>
    }

    let {
      type,
      data
    } = post_graphs[this.state.name]

    if(!type) {
      type = 'line'
    }

    const pie_classes = classnames({
      btn: true,
      ['btn--active']: type === 'pie'
    })

    const line_classes = classnames({
      btn: true,
      ['btn--active']: type === 'line'
    })

    const main = data && !this.state.edit ? (
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
          <Graph data={data} type={type} id={this.state.id}></Graph>
        </div>
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
