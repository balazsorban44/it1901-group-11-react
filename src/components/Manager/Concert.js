import React, { Component } from 'react'

class Concert extends Component{


  render(){
    const {band, from, to, bandFee, isAcceptedByBookingBoss, isAcceptedByBookingManager} = this.props.concert
    return (
      <div>
      <p>band: {band}</p>
      <p>bandFee: {bandFee}</p>
      <p>isAcceptedByBookingBoss: {isAcceptedByBookingBoss}</p>
      <p>isAcceptedByBookingManager: {isAcceptedByBookingManager}</p>
      <p>from: {from}</p>
      <p>to: {to}</p>
      <br />
      </div>
    )
  }
}

export default Concert
