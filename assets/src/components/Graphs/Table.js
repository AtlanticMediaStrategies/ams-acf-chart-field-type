import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import styles from './style.scss'
import classnames from 'classnames'
import moment from 'moment'
import { parse_date } from './utils.js'

/**
 *  Table component
 */
export default class Table extends Component {

  constructor(props) {
    super(props)
    this.state = {
      current_column: 1
    }
  }

  componentDidMount()  {
    const elm = ReactDOM.findDOMNode(this)
    const legends = [...elm.querySelectorAll(`.${styles.tableCellLegend} div`)]

    const { data } = this.props

    legends.forEach((cell, i) => {
      if(cell.classList.contains(styles.tableRowHeader)) {
        return
      }
      const textHeight = cell.querySelector('p').offsetHeight + 35
      cell.style.height = `${textHeight}px`

      Array.from(document.querySelectorAll(`.tableColumnsContainer .${styles.tableCell}:nth-child(${i + 1})`))
      .forEach(child =>  {
        Object.assign(child.style, {
          height: `${textHeight}px`
        })
      })
    })
  }

  set_current_column(current_column) {
     this.setState({ current_column })
  }

  render() {
    const {
      data,
      x_axis,
      active_columns,
      active_rows
    } = this.props

    const columns =
      active_columns
        .sort()
        .map(col => {

          const rows =
            active_rows
              .map((row_included, row)  => {

                if(!row_included) {
                  return row_included
                }

                const dat = data[row][col]

                const colClasses = classnames({
                  [styles.tableCell]: true,
                  [styles.tableRowHeader]: row == 0,
                  [styles.tableCellCurrent]: col == this.state.current_column
                })

                if(row == 0) {
                  var date = parse_date(dat)
                  var val = date.format('MMM \'YY')
                  var metric = ''
                } else {
                  const is_not_numeric = dat.toString().match(/\W/)
                  var val = dat
                  var metric = is_not_numeric ? '' : '%';
                }
                return (
                  <div
                    onClick={ this.set_current_column.bind(this, col) }
                    className={ colClasses }><p>{ val }{ metric }</p></div>
                )
            })
            .filter(row => row != false)

        return <div className={styles.tableColumn}>{ rows }</div>
      })


    const metric_classes = classnames({
      [styles.tableColumn]: true,
      [styles.tableCellLegend]: true
    })

    const first_columns =
      data.map((datum, row) => {
        const val = (row == 0) ? x_axis : data[row][0]
        const classes = classnames({
          [styles.tableCell]: true,
          [styles.tableRowHeader]: row == 0
        })
        return (
          <div className={ classes }>
            <p>{ val }</p>
          </div>
        )
    })

    const legend = <div className={ metric_classes }>{ first_columns }</div>

    return (
      <div className={ styles.table }>
        <div className="tableLegendContainer">
          { legend }
        </div>
        <div className="tableColumnsContainer">
          { columns }
        </div>
      </div>
    )
  }
}
