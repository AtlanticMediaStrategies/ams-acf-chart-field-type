import React, { Component } from 'react'
import AxisForm from '../../components/Form/AxisForm.js'
import { Label, Input, Button } from 'rebass'
import styles from './styles.scss'

export default class AxisFormContainer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      x: props.graph.x_axis,
      y: props.graph.y_axis
    }
    const throttle_options = { leading: true, trailing: true}
    this.debounced_x = _.throttle(this.update_x_axis, 80, throttle_options);
    this.debounced_y = _.throttle(this.update_y_axis, 80, throttle_options);
  }

  update_x_axis({target}) {
    if(!target) {
      return
    }
    const { id, name } = this.props
    this.props.set_graph_value(id, name, {x_axis: target.value })
  }

  update_y_axis({target}) {
    if(!target) {
      return
    }
    const { id, name } = this.props
    this.props.set_graph_value(id, name, {y_axis: target.value})
  }

  render() {
    if(this.props.display === 'none') {
      return <div></div>
    }

    const { x_axis, y_axis } = this.props.graph

    return (
      <div className={styles.wrapper}>
        <h1>Edit Axis Labels</h1>
        <form
          style={{marginBottom: '8px'}}>
          <fieldgroup>
            <Input
              onChange={this.update_x_axis.bind(this)}
              label="X Axis"
              name="x_axis"
              value={x_axis}
              type="text"
             ></Input>
          </fieldgroup>
          <fieldgroup>
            <Input
              name="y_axis"
              label="Y Axis"
              onChange={this.debounced_y.bind(this)}
              value={y_axis}
              type="text"
            ></Input>
          </fieldgroup>
        </form>
      </div>
    )
  }
}
