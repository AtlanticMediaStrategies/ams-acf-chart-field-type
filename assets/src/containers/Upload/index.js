import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import csv from 'csv'
import request from 'reqwest-without-xhr2'

import * as actionCreators from '../../actions/app.js';

@connect(
  state => state.app,
  dispatch => bindActionCreators(actionsCreators, dispatch)
)
export default class FileUpload extends Component {

  /**
   *  @param files {array}
   */
  handleFiles(files) {
    const reader = new FileReader()
    reader.onload = () => {
      csv.parse(reader.result, (err, res) => {
        if(err)
          throw err
        // upload json
        request({
          url: `/acf-chart/update/${this.props.id}`,
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

  render() {
    return (
      <Dropzone onDrop={this.handleFiles.bind(this)} accept="text/csv">
        <div className="drop-text">
          Drop csv files here or click to trigger form.
        </div>
      </Dropzone>
    )
  }
}
