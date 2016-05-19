import React, { Component } from 'react'
import styles from './style.scss'

export default class Legend extends Component {

  static propTypes = {
    data: React.PropTypes.array,
    colors: React.PropTypes.array
  }

  render() {
    const {
      data,
      colors
    } = this.props

    const legends = data.map((datum, i) => {
      if(datum === false) {
        return false
      }
      return (<div className={styles.legendBoxList}>
        <div
          className={styles.legendBox}
          style={{ backgroundColor: colors[i + 1] }}></div>
        <span className={styles.legendLabel}> { datum[0] } </span>
        </div>
      )
    }).filter(datum => datum != false)

    return (
      <nav className={ styles.legend }>
        { legends }
      </nav>
    )
  }
}
