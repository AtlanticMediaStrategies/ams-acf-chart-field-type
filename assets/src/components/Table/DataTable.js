import React, {Component} from 'react';

export default class DataTable extends Component {
  render() {
    if(!this.props.data) {
      return <div></div>
    }
    let data = [...this.props.data]

    const rows = this.props.data.map((row, i) => {
      const columns = row.map((column, j) => {
        return (
          <td key={j}>{column}</td>
        )
      })
      return (
        <tr key={i}>
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
