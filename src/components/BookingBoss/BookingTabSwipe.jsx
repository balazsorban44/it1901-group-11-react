import React, { Component } from 'react'

import {Tabs, Tab} from 'material-ui/Tabs'
import SwipeableViews from 'react-swipeable-views'

export default class TabsExampleSwipeable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
    };
  }

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  };

  render() {
    const {unhandledCounter, unhandledBookings, acceptedCounter, acceptedBookings, rejectedCounter, rejectedBookings} = this.props
    const {slideIndex} = this.state
    return (
      <div>
        <Tabs
          onChange={this.handleChange}
          value={slideIndex}>
          <Tab label={`New(${unhandledCounter})`} value={0}/>
          <Tab label={`Accepted(${acceptedCounter})`} value={1}/>
          <Tab label={`Rejected(${rejectedCounter})`} value={2}/>
        </Tabs>
        <SwipeableViews
          index={slideIndex}
          onChangeIndex={this.handleChange}
        >
          <Bookings bookings={unhandledBookings}/>
          <Bookings bookings={acceptedBookings}/>
          <Bookings bookings={rejectedBookings} />
        </SwipeableViews>
      </div>
    );
  }
}


const Bookings = ({bookings}) => {
  return (
    <ul className="booking-list">
      {bookings}
    </ul>
  )
}
