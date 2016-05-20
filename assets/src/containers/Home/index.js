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
  saveImage(graph, e) {
    e.preventDefault()
    // this.setState({overlay_open: true})
    require(['fabric-webpack', 'notie'], ({fabric}, notie) => {
      const {
        Canvas,
        Image,
        Text,
        Rect
      } = fabric;

      const elm = ReactDOM.findDOMNode(this)
      let parent = elm.parentNode;
      while(!parent.classList.contains('acf-fields')) {
        parent = parent.parentNode;
      }

      const title = parent.querySelector('div[data-name="title"] input').value
      const subtitle = parent.querySelector('div[data-name="subtitle"] input').value
      const description = parent.querySelector('div[data-name="description"] textarea').textContent

      const svg = elm.querySelector('svg')
      const can = new Canvas();

      const viewbox = svg.getAttribute('viewBox').split(/\s+/)

      const width = parseInt(viewbox[2])
      const height = parseInt(viewbox[3])

      can.setWidth(width + 200)
      can.setHeight(height + 400)
      can.setBackgroundColor('white')

      const {
        type,
        data,
        active_rows,
        colors
      } = graph

      const rows_clone = [...active_rows]

      if(type === 'bar' || type === 'line') {
        // generate legend
        let n = 0;
        rows_clone.reverse().forEach((row, i) => {
          if(row === true && i > 0) {
            console.log(`row: ${row}, i: ${i}`)
            const color = colors[colors.length - i]
            const label = data[data.length - i][0]

            const top = can.getHeight() - (n++ * 30) - 60

            const rect = new Rect({
              fill: color,
              width: 16,
              height: 16
            })
            rect.setTop(top)
            rect.setLeft(20)
            can.add(rect)

            const text = new Text(label, {
              fontFamily: 'allstate-sans',
              fontSize: 14,
              lineheight: 16
            })
            text.setLeft(55)
            text.setTop(top + 2)
            can.add(text)
          }
        })
      }

      const id = elm.parentNode.getAttribute('id')
      fabric.parseSVGDocument(svg, (layers) => {
        layers.forEach((layer) => {
          if(type === 'line' && layer.text && layer.fill != '#A5B3BE') {
            layer.setLeft(layer.getLeft() + 9000) //remove label
          } else {
            layer.setLeft(layer.getLeft() + 80)
          }
          if(type === 'bar' && layer.text && layer.fill === 'white') {
            layer.setTop(layer.getTop() + 130)
          } else {
            layer.setTop(layer.getTop() + 120)
          }
          can.add(layer)
        })

        const titleElement = new Text(title, {
          fill: '#E12C8A',
          fontSize: 32,
          fontWeight: 'bold',
          fontFamily: 'allstate-sans, sans-serif'
        })
        titleElement.setTop(20)
        titleElement.setLeft(20)
        can.add(titleElement)

        const subtitleElement = new Text(subtitle, {
          fill: '#2F353E',
          fontSize: 24,
          fontFamily: 'allstate-sans, sans-serif'
        })

        subtitleElement.setTop(64)
        subtitleElement.setLeft(20)
        can.add(subtitleElement)

        Image.fromURL('/wp-content/themes/renewal-project/img/export-logo.png', (img) => {
          img.setTop(can.getHeight() - img.getHeight() - 20)
          img.setLeft(can.getWidth() - img.getWidth() - 20)

          can.add(img)

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
          .then((res) => {
            const json = JSON.parse(res)
            const { id, name } = this.state
            this.props.set_graph_value(id, name, {
              thumbnail: json.url
            })
            notie.alert(1, 'Success!', 2)
          })
          .fail(() => notie.alert(2, 'An error occurred', 2))
        })
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
          onClick={this.saveImage.bind(this, graph)}>Generate image export
        </Button>
        <div>
          <img src={graph.thumbnail} style={{width: '100%', height: 'auto'}}/>
        </div>
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
