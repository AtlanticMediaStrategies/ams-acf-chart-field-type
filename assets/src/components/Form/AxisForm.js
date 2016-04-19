import React, { Component } from 'react'
import AxisForm from '../../components/Form/AxisForm.js'
import { Label, Input, Button } from 'rebass'
import styles from './styles.scss'
import { Flex, Box} from 'reflexbox';

export default class AxisFormContainer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      title: props.graph.title || "",
      subtitle: props.graph.subtitle || "",
      subtitle: props.graph.source || "",
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
    const { title, subtitle, x_axis, y_axis, source } = this.state;
    this.props.set_graph_value(this.props.id, this.props.name,  {
      title,
      subtitle,
      x_axis,
      y_axis,
      source
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
    const title = this.props.graph.title || ""
    const subtitle = this.props.graph.subtitle || ""

    return (
      <div className={styles.wrapper}>
        <Flex wrap={true}>
          <Box col={6} px={1}>
            <Input
              label="Title"
              name="title"
              onChange={this.update_state.bind(this, 'title')}
              defaultValue={title}
            >
            </Input>
          </Box>
          <Box col={6} px={1}>
            <Input
              label="Subtitle"
              name="subtitle"
              onChange={this.update_state.bind(this, 'subtitle')}
              defaultValue={subtitle}
            >
            </Input>
          </Box>
          <Box col={12} px={1}>
            <Input
              label="Source"
              name="source"
              onChange={this.update_state.bind(this, 'source')}
              defaultValue={subtitle}
            >
            </Input>
          </Box>
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
          Update Graph
        </Button>
      </div>
    )
  }
}
