import React, { Component } from 'react'
import styles from './style.scss'
import classnames from 'classnames'
import { Button } from 'rebass'
import { CompactPicker }from 'react-color'
import { chart_colors } from '../Graphs/config.js'

/**
 *  @class ColorEdit
 *  Renders a button that triggers the color picker for the data table
 */
export class HideShow extends Component {

    /**
     *  @param index {integer} row to show
     */
    show_row( index, e) {
      e.preventDefault()
      this.props.show_row(index, this.props.name);
    }

    /**
     *  @param index {integer} row to hide
     */
    hide_row( index, e) {
      e.preventDefault()
      this.props.hide_row(index, this.props.name);
    }

    render() {
      const { i, active, colors } = this.props

      return (
        <td
          key='display'
          className="tableCell"
         >
          <Button
            role="button"
            theme="error"
            style={{display: active ? 'inline' : 'none'}}
            onKeyDown={ this.hide_row.bind(this, i) }
            onClick={ this.hide_row.bind(this, i) }>
            Hide
          </Button>

          <Button
            style={{display: active ? 'none' : 'inline'}}
            onClick={ this.show_row.bind(this, i) }
            theme="success"
          >
            Show
          </Button>
        </td>
      )
    }
}


export class EditColor extends Component {

  constructor() {
    super()
    this.state = {
      picker_open: false
    }
  }

  /**
   *  Calls redux action set_color
   *
   *  @param color.hex {string} passed in by react-color
   */
  save_color({hex}) {
    this.props.set_color(
      `#${hex}`,
      this.props.graph,
      this.props.activeRow,
      this.props.name,
      this.props.id )
  }

 /**
   *  Calls redux action
   */
  toggle_color(index, e) {
    e.preventDefault()
    this.setState({picker_open: true})
    this.props.toggle_color(index, this.props.name)
  }

  /**
   *  Calls redux action
   */
  cancel_color(index, e) {
    e.preventDefault()
    this.props.cancel_color(index, this.props.name)
  }

  /**
   *  Hides the picker so user can click save or cancel
   */
  picker_closed() {
    this.setState({picker_open: false})
  }

  render() {

    const {
      i,
      active,
      colors,
      activeRow,
      activeName,
      name
    } = this.props

    return (
      <td
        key='edit'
        className="tableCell"
       >
        <Button
          role="button"
          backgroundColor={ colors[i] }
          style={{display: active ? 'none': 'inline'}}
          onKeyDown={ this.toggle_color.bind(this, i) }
          onClick={ this.toggle_color.bind(this, i) }>
          Edit
        </Button>

        <Button
          style={{display: active ? 'inline': 'none'}}
          onClick={this.props.reset_active.bind(this)}
          theme="success"
        >
          Save
        </Button>

        <Button
          style={{
            color: "#111",
            marginTop: '8px',
            display: active ? 'inline': 'none'
          }}
          onClick={ this.cancel_color.bind(this, i) }
          theme="info"
        >
          Cancel
        </Button>

        { false ?
          <CompactPicker
            color={ colors[i] }
            onChange={ this.save_color.bind(this) }
            onClose={ this.picker_closed.bind(this) }
            colors={ chart_colors }
          >
          </CompactPicker> : null
        }
      </td>
    )
  }
}
