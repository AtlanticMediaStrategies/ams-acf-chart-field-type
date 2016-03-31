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
  }

  update_x_axis({target}) {
    this.setState({
      x: target.value
    })
  }

  update_y_axis({target}) {
    this.setState({
      y: target.value
    })
  }

  update_axis(e) {
    e.preventDefault()
    this.props.update_label(this.state.x, 'x', this.props.name)
    this.props.update_label(this.state.y, 'y', this.props.name)
  }

  render() {
    if(this.props.display === 'none') {
      return <div></div>
    }

    return (
      <div className={styles.wrapper}>
        <h1>Edit Axis Labels</h1>
        <form
          onSubmit={this.update_axis.bind(this)}
          style={{marginBottom: '8px'}}>
          <fieldgroup>
            <Input
              onChange={this.update_x_axis.bind(this)}
              label="X Axis"
              name="x_axis"
              value={this.state.x}
              type="text"
             ></Input>
          </fieldgroup>
          <fieldgroup>
            <Input
              name="y_axis"
              label="Y Axis"
              onChange={this.update_y_axis.bind(this)}
              value={this.state.y}
              type="text"
            ></Input>
          </fieldgroup>
          <Button>Update Axis Labels</Button>
        </form>
      </div>
    )
  }
}
