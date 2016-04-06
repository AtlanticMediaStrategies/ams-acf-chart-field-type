import React, {Component} from 'react'
import styles from './style.scss'
import { Button, Checkbox } from 'rebass'
import classnames from 'classnames'
import { HideShow, EditColor} from './TableUtils.js'

export default class DataTable extends Component {

  constructor(props) {
    super(props)
    this.state = {
      activeEdit: false
    }

    // debounce constrain_columns
    this.debounced_constrained_columns =
      window._.debounce(this.constrain_columns, 100)
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
  set_current_column(j, e) {
    e.preventDefault()
    const {
      columns_constrained
    } = this.props.graph

    if(j < 1 || columns_constrained !== true) {
      return
    }

    const { id, name } = this.props
    this.props.toggle_column(j, name)
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
    const {
      active_columns,
      columns_constrained,
      currentColumn
    } = this.props.graph

    const cell_active = columns_constrained && active_columns.includes(j)

    return classnames({
      [styles.tableCell]: true,
      [styles.tableCellActive]: cell_active
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
      [styles.tableRow]: true,
      [styles.tableRowHidden]: !graph.active_rows[i]
    })
  }

  /**
   *  Toggles the columns_constrained option for graphs
   */
   constrain_columns(e) {
    const { id , name, graph } = this.props
    const columns_constrained = !graph.columns_constrained
    this.props
      .set_graph_value(id, name, { columns_constrained })
   }

  render() {

    const {
      graph,
      activeRow,
      activeName
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
            onClick={ this.set_current_column.bind(this, j) }
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
            i={i}
            key={`edit-${i}`}
            active={this.active_row(i)}
            colors={colors}
            update_graph={this.update_graph}
            {...this.props}
          ></EditColor>
        )
      } else {
        // legends
        columns.unshift(<td key='hide' className={styles.tableCell}>Hide?</td>)
        columns.unshift(<td key='label' className={styles.tableCell}>Color</td>)
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
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>

        <Checkbox
          label="Constrain columns"
          name="constrain"
          onClick={this.debounced_constrained_columns.bind(this)}
          checked={graph.columns_constrained === true}
        ></Checkbox>
      </div>
    )
  }
}
