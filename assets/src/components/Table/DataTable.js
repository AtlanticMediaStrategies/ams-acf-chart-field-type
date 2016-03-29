import React, {Component} from 'react';
import styles from './style.scss';
import { Button } from 'rebass'

export default class DataTable extends Component {


  set_color(i, color, e) {
    e.preventDefault()
    this.props.set_color(color, this.props.name, i)
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
            <Button onClick={ this.set_color.bind(this, i - 1, '#000000') }>Edit</Button>
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
