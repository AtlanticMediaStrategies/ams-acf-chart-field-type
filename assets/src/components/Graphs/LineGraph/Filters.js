import React, { Component } from 'react'

export default class Filters extends Component {
  componentDidMount() {

  }

  filter() {
    return {__html: `<filter id="dropshadow" x="-200%" y="-200%" height="400%" width="400%">
                <feComponentTransfer in="SourceAlpha">
                   <feFuncR type="discrete" tableValues="0"/>
                   <feFuncG type="discrete" tableValues="0"/>
                   <feFuncB type="discrete" tableValues="0"/>
               </feComponentTransfer>
               <feGaussianBlur stdDeviation="4"/>
               <feOffset dx="0" dy="0" result="shadow"/>
               <feComposite in="SourceGraphic" in2="shadow" operator="over"/>
            </filter>`};
  }

  render() {
    return <defs dangerouslySetInnerHTML={this.filter()}></defs>
  }

}
