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
import { Radio, Button, Divider, Checkbox, Overlay, Close } from 'rebass';
import DataTable from '../../components/Table/DataTable.js';
import RadioGroup from './RadioGroup.js';
import Form from '../../components/Form/AxisForm.js';
import { initialGraph } from '../../models/graph.js';

import qs from 'qs';

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
export default class Home extends Component {
  constructor(props) {
    super(props)
    // disable prompt acf has when navigating away from page
    Object.assign(window.acf.unload, {active: false})
    const { id, name, created, data } = props;
    this.state = {
      id,
      name,
      created,
      edit: false,
      overlay_open: false
    }
  }

  static childContextTypes = {
    rebass: React.PropTypes.object
  }

  /**
   *  Calculate which graph to pull in
   */
  componentDidMount() {
    const { id, name, data, created } = this.props
    if(created === false) {
      this.props.set_data(data, id, name)
    }
  }

  /**
   *  @function saveImage
   *  @description parses with fabric and posts
   */
  saveImage(e) {
    e.preventDefault()
    this.setState({overlay_open: true})
    require(['fabric-webpack', 'notie'], ({fabric}, notie) => {
      const {
        Canvas
      } = fabric;

      const elm = ReactDOM.findDOMNode(this)
      const svg = elm.querySelector('.Overlay svg')
      const can = new Canvas();

      let {
        height,
        width
      } = svg.style;

      height = parseInt(height.replace('px', ''))
      width = parseInt(width.replace('px', ''))

      can.setWidth(width);
      can.setHeight(height);

      const id = elm.parentNode.getAttribute('id')
      fabric.parseSVGDocument(svg, (layers) => {
        layers.forEach(layer => can.add(layer))
        let data = can.toDataURL()
        if(data === 'data:,') {
          notie.alert(3, 'Failed to parse svg', 2);
          return
        }

        data = data.replace('data:image/png;base64,', '')

        request({
          method: 'POST',
          url: `/acf-chart/thumbnail/${this.state.id}/${this.state.name}/`,
          data: {
            base64: data
          }
        })
        .then(() => {
          notie.alert(1, 'Success!', 2)
          this.setState({overlay_open: false})
        })
        .fail(() => notie.alert(2, 'An error occurred', 2))
      })
    })
  }

  /**
   *  Configure Rebass
   */
  getChildContext() {
    return {
      rebass: {
        colors: {
          primary: '#4088DD',
          success: '#77CD19',
          error: '#CD051E',
          info: '#AAA'
        },
        inverted: '#FDFDFD',
        Button: {
          textTransform: 'uppercase',
          letteSpacing: '0.05em'
        }
      }
    }
  }

  /**
   *  @param files {array}
   */
  handleFiles(files) {
    const reader = new FileReader()
    reader.onload = () => {
      csv.parse(reader.result, (err, res) => {
        if(err) {
          throw err
        }
        const graph = Object.assign({data: res, type: 'line'}, initialGraph);
        this.props.create_graph(graph, this.state.id, this.state.name)
        this.setState({
          edit: false
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
      edit: !this.state.edit
    })
  }

  toggleOverlay(e) {
    e.preventDefault()
    this.setState({overlay_open: !this.state.overlay_open})
  }

  render() {
    // cloned from acfcloneindex
    if(this.state.created === true) {
      return (
        <p>
          Please update post to upload the csv files.
        </p>
      )
    }

    const { graphs, id , name } = this.props
    const post_graph = graphs[id];
    if(!post_graph) {
      return <div>loading...</div>
    }

    const graph = graphs[id][name]

    if(!graph) {
      return <div>loading</div>
    }


    let {
      type,
      data,
      colors,
      currentColumn
    } = graph

    if(!type) {
      type = 'line'
    }

    const main = data && !this.state.edit ? (
      <div>
        <h3 for="pie">Chart</h3>
        <RadioGroup
          post_id={this.state.id}
          name={this.state.name}
          type={type}
          {...this.props}
        >
        </RadioGroup>
        <Graph
          graph={graph}
          disableAnimation={true}
          id={this.state.id}
        >
        </Graph>

        <DataTable
          name={this.state.name}
          id={this.state.id}
          graph={graph}
          type={type}
          currentColumn={currentColumn}
          {...this.props}
        ></DataTable>

        <Form
          display={graph.type == 'pie' ? 'none' : 'block'}
          graph={graph}
          name={this.state.name}
          id={this.state.id}
          {...this.props}>
        </Form>

        <Divider/>

        <h1> Graph Settings </h1>

        <Button
          theme='success'
          style={{ marginRight: '8px' }}
          onClick={this.saveImage.bind(this)}>Save as thumbnail
        </Button>
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

        <Divider/>

        <Button
          backgroundColor={this.state.edit === true ? 'white': 'primary'}
          color={this.state.edit === true ? 'primary': 'white'}
          style={{ marginRight: '8px' }}
          onClick={this.toggleEdit.bind(this)}>Edit data
        </Button>

        <Overlay
          style={{
            backgroundColor: '#FDFDFD',
            textAlign: 'center'
          }}
          open={this.state.overlay_open}
          dark={true}
          box={true}
        >
          <div style={{border: '2px double #111111'}}>
            <Graph
              graph={graph}
              disableAnimation={true}
              id={this.state.id}
            >
            <h1 style={{textAlign: 'center'}}>Generating graph...</h1>
            </Graph>
            <Close
              style={{position: 'absolute', right: '10px', top: '10px'}}
              onClick={this.toggleOverlay.bind(this)}>
            </Close>
          </div>
        </Overlay>

        <input
          readOnly
          type="hidden"
          name={this.state.name}
          value={JSON.stringify(graph)} />

      </section>
    );

  }
}
