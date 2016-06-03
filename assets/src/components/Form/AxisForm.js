import React, { Component } from 'react'
import AxisForm from '../../components/Form/AxisForm.js'
import { Label, Input, Button, Divider } from 'rebass'
import styles from './styles.scss'
import { Flex, Box } from 'reflexbox';

export default class AxisFormContainer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      x_axis: props.graph.x_axis,
      y_axis: props.graph.y_axis,
    }
  }

  update_state(name, { target }) {
    if(!target) {
      return
    }
    this.setState({[name]: target.value});
  }

  update_graph(e) {
    e.preventDefault()
    const { x_axis, y_axis } = this.state;
    this.props.set_graph_value(this.props.id, this.props.name,  {
      x_axis,
      y_axis
    })
  }

  update_x_axis({target}) {
    if(!target) {
      return
    }
    const { id, name } = this.props
    this.setState({x: target.value})
  }

  update_y_axis({target}) {
    if(!target) {
      return
    }
    const { id, name } = this.props
    this.setState({y: target.value})
  }

  render() {
    if(this.props.display === 'none') {
      return <div></div>
    }

    const { x_axis, y_axis } = this.props.graph

    return (
      <div className="axisWrapper">
        <Divider></Divider>
        <h1>Axis Labels</h1>
        <Flex wrap={true}>
          <Box col={6} px={1}>
            <Input
              label="X Axis"
              name="x_axis"
              defaultValue={x_axis}
              onChange={this.update_state.bind(this, 'x_axis')}
              type="text"
             ></Input>
           </Box>
          <Box col={6} px={1}>
            <Input
              name="y_axis"
              label="Y Axis"
              onChange={this.update_state.bind(this, 'y_axis')}
              defaultValue={y_axis}
              type="text"
            ></Input>
          </Box>
        </Flex>
        <Button theme='success' onClick={this.update_graph.bind(this)}>
          Update Graph Labels
        </Button>
      </div>
    )
  }
}
