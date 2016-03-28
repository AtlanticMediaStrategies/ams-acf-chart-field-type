import React, {Component} from 'react';
import styles from './style.scss';

export default class DataTable extends Component {
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
      return (
        <tr className={styles.tableRow} key={i}>
          {columns}
        </tr>
      )
    });

    return (
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    )
  }
}
