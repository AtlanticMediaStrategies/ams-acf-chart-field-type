import React, {Component} from 'react'
import styles from './style.scss'
import { Button } from 'rebass'
import Picker from 'react-color'

export default class DataTable extends Component {

  constructor(props) {
    super(props)
    this.state = {
      activeEdit: false
    }
  }

  toggle_color(i, e) {
    e.preventDefault()
    if(this.state.activeEdit !== false ) {
      var activeEdit = false
    } else {
      var activeEdit = i
    }
    this.setState({
      activeEdit
    })
  }

  set_color(i, {hex}) {
    this.props.set_color(`#${hex}`, this.props.name, i - 1)
  }

  render() {
    if(!this.props.data) {
      return <div></div>
    }
    let data = [...this.props.data]

    const rows = this.props.data.map((row, i) => {
      const columns = row.map((column, j) => {
        return (
          <td
            className={styles.tableCell}
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
              onKeyDown={ this.toggle_color.bind(this, i) }
              onClick={ this.toggle_color.bind(this, i) }>
              Edit
            </Button>
            <Picker
              type="sketch"
              onChange={this.set_color.bind(this, i)}
              display={ this.state.activeEdit === i }
            >
            </Picker>
          </td>
        )
      } else {
        columns.unshift(<td key='blank' className={styles.tableCell}></td>)
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
