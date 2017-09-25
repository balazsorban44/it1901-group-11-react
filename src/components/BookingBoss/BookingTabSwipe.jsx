import React, { Component } from 'react'

import {Tabs, Tab} from 'material-ui/Tabs'
import SwipeableViews from 'react-swipeable-views'


const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  slide: {
    padding: 10,
  },
};

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
    return (
      <div>
        <Tabs
          onChange={this.handleChange}
          value={this.state.slideIndex}>
          <Tab label={`New bookings (${unhandledCounter})`} value={0}/>
          <Tab label={`Accepted bookings (${acceptedCounter})`} value={1}/>
          <Tab label={`Rejected bookings (${rejectedCounter})`} value={2}/>
        </Tabs>
        
        <SwipeableViews
          index={this.state.slideIndex}
          onChangeIndex={this.handleChange}
        >
          <div>
            <Bookings bookings={unhandledBookings}/>
          </div>
          <div>
            <Bookings bookings={acceptedBookings}/>
          </div>
          <div>
            <Bookings bookings={rejectedBookings} />
          </div>
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
