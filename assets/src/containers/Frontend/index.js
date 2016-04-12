import React, {Component} from 'react'

import Graph from '../Graph';

const Frontend = ({id, data, name}) => {
  return (
    <Graph
      graph={data}
      name={name}
      id={id}
    />
  )
}

export default Frontend;
