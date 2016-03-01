import React, {Component} from 'react';

export default class DataTable extends Component {
  render() {
    if(!this.props.data) {
      return
    }
    const rows = this.props.data.map((rows, i) => {
      const columns = rows.map(column => {
        return (
          <td>{column}</td>
        )
      })
      return (
        <tr>
          {columns}
        </tr>
      )
    });
    return (
      <table width="100%">
        <tbody>
          {rows}
        </tbody>
      </table>
    )
  }
}
