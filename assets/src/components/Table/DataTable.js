import React, {Component} from 'react'
import styles from './style.scss'
import { Button } from 'rebass'
import Picker from 'react-color'
import classnames from 'classnames'

export default class DataTable extends Component {

  constructor(props) {
    super(props)
    this.state = {
      activeEdit: false
    }
    // debounce save_color
    this.set_color = window._.debounce(this.save_color, 200)
  }

  /**
   *  Calls redux action
   */
  toggle_color(index, e) {
    e.preventDefault()
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
   *  Calls redux action when 'save' button is clicked
   */
  update_graph(e) {
    e.preventDefault()
    const { graph, id, name } = this.props
    this.props.save_graph(graph, id, name)
  }

  /**
   * Calls redux action
   */
  set_current_column(j, e) {
    e.preventDefault()
    if(this.props.type !== 'pie') {
      return
    }
    this.props.set_current_column(j, this.props.name)
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
   *
   */
  cellClasses(j) {
    const {
      currentColumn
    } = this.props

    return classnames({
      [styles.tableCell]: true,
      [styles.tableCellActive]: currentColumn === j
    })
  }

  /**
   *  Determines whether the row is active or not
   *  Useful for displaying picker/save button or edit button
   *
   *  @param i {integer} nth row
   *  @param name { string } key of the graph
   *
   *  @return {boolean} whether current row is active
   */
  active_row(i) {
    const { activeRow, activeName, name } = this.props;
    return i === activeRow && name === activeName;
  }

  render() {
    if(!this.props.graph) {
      return <div></div>
    }
    let {  colors, data } = this.props.graph;
    data = [...data]

    const rows = data.map((row, i) => {
      const columns = row.map((column, j) => {
        return (
          <td
            className={ this.cellClasses(j) }
            onClick={ this.set_current_column.bind(this, j) }
            key={j}>
              {column}
          </td>
        )
      })
      if(i > 0) {
        columns.unshift(
          <td
            key='edit'
            className={styles.tableCell}
           >
            <Button
              role="button"
              backgroundColor={this.props.graph.colors[i]}
              style={{display: this.active_row(i) ? 'none': 'inline'}}
              onKeyDown={ this.toggle_color.bind(this, i) }
              onClick={ this.toggle_color.bind(this, i) }>
              Edit
            </Button>

            <Button
              style={{display: this.active_row(i) ? 'inline': 'none'}}
              onClick={ this.update_graph.bind(this) }
              theme="success"
            >
              Save
            </Button>

            <Button
              style={{
                color: "#111111",
                marginTop: '8px',
                display: this.active_row(i) ? 'inline': 'none'
              }}
              onClick={ this.cancel_color.bind(this, i) }
              theme="info"
            >
              Cancel
            </Button>



            <Picker
              type="chrome"
              color={ colors[i] }
              onChange={ this.set_color.bind(this) }
              display={
                this.props.activeRow === i &&
                this.props.activeName === this.props.name
              }
            >
            </Picker>
          </td>
        )
      } else {
        columns.unshift(<td key='label' className={styles.tableCell}>Color</td>)
      }
      return (
        <tr className={styles.tableRow} key={i}>
          {columns}
        </tr>
      )
    });

    return (
      <div>
        <h1>Data Table</h1>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
