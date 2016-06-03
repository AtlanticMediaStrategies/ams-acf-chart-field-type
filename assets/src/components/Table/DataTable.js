import React, {Component} from 'react'
import styles from './style.scss'
import { Button, Checkbox } from 'rebass'
import classnames from 'classnames'
import { HideShow, EditColor} from './TableUtils.js'

export default class DataTable extends Component {

  constructor(props) {
    super(props)
    this.state = {
      activeEdit: false,
      mousedown: false
    }
    window.addEventListener('mousedown', () => {
      this.setState({mousedown: true})
    })
    window.addEventListener('mouseup', () => {
      this.setState({mousedown: false})
    })
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
   * Calls redux action if column is not the first column
   * Assumes that first-column is the category
   */
  set_current_column(row, column, e) {
    e.preventDefault()
    if(column < 1 && row === 0) {
      return
    }

    const { id, name } = this.props
    this.props.toggle_column(column, name)
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
   *  Determines whether a column is active or not
   *
   *  Is opaque when row is hidden
   *  Is blue when column is active
   *
   *  @param {integer} j, the column
   */
  cellClasses(j) {
    const { active_columns } = this.props.graph
    return classnames({
      tableCell: true,
      tableCellActive: active_columns.includes(j)
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

  /**
   *  Determines styling of current row
   *
   *  Is opaque if index in active_rows is false
   */
  row_classes(i) {
    const { graph } = this.props
    return classnames({
      tableRow: true,
      tableRowHidden: !graph.active_rows[i]
    })
  }

  /**
   *  Selects all columns
   */
  show_all_columns(e) {
    e.preventDefault()
    this.props.show_all_columns(this.props.name)
  }

  /**
   *  Hides all columns
   */
   hide_all_columns(e) {
    e.preventDefault()
    this.props.hide_all_columns(this.props.name)
   }


   mouse_over(row, column) {
    if(row === 0 && this.state.mousedown)  {
      this.props.toggle_column(column, this.props.name)
    }
   }

  render() {

    const {
      graph,
      activeRow,
      activeName,
      reset_active
    } = this.props

    if(!graph) {
      return <div></div>
    }

    let {
      colors,
      data,
      active_rows
    } = graph;

    // clone data so we don't mutate it
    data = [...data]

    const rows = data.map((row, i) => {
      const columns = row.map((column, j) => {
        return (
          <td
            className={ this.cellClasses(j) }
            onMouseDown={ this.set_current_column.bind(this, i, j) }
            onMouseOver={ this.mouse_over.bind(this, i, j) }
            key={j}>
              {column}
          </td>
        )
      })
      if(i > 0) {

        columns.unshift(
          <HideShow
            i={i}
            key={`hide-show-${i}`}
            active={active_rows[i] === true}
            name={this.props.name}
            show_row={this.props.show_row}
            hide_row={this.props.hide_row}
          ></HideShow>
        )

        columns.unshift(
          <EditColor
            i={ i }
            key={`edit-${i}`}
            active={ this.active_row(i) }
            colors={ colors }
            reset_active={ this.props.reset_active }
            {...this.props}
          ></EditColor>
        )
      } else {
        // legends
        columns.unshift(<td key='hide' className="tableCell">Hide?</td>)
        columns.unshift(<td key='label' className="tableCell">Color</td>)
      }
      return (
        <tr
          className={this.row_classes(i)}
          key={i}>
            {columns}
        </tr>
      )
    })

    return (
      <div>
        <h1>Data Table</h1>
        <div className="tableContainer">
          <table className="table">
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
        <nav style={{margin: '0.3em 0'}}>
          <Button
            style={{marginRight: '0.25em'}}
            theme='error'
            onClick={this.hide_all_columns.bind(this)}
            pill={true}>
              Hide All Columns
          </Button>
          <Button
            theme='success'
            onClick={this.show_all_columns.bind(this)}
            pill={true}>
            Show All Columns
          </Button>
        </nav>
      </div>
    )
  }
}
