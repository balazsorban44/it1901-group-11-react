import React, { Component } from 'react'

import {Tabs, Tab} from 'material-ui/Tabs'
import RaisedButton from 'material-ui/RaisedButton'
import firebase from 'firebase'
import {parseDate, parseTime, parsePrice, Loading} from '../../utils'

export default class Bookings extends Component {

  render() {
    const {unhandledCounter, unhandledBookings, acceptedCounter, acceptedBookings, rejectedCounter, rejectedBookings} = this.props
    return (
      <Tabs>
        <Tab label={`New(${unhandledCounter})`}>
          {unhandledCounter !== 0 ?
            <BookingTab bookings={unhandledBookings}/>
          :
          <Loading/>}
        </Tab>/>
        <Tab label={`Accepted(${acceptedCounter})`}>
          <BookingTab bookings={acceptedBookings}/>
        </Tab>/>
        <Tab label={`Rejected(${rejectedCounter})`}>
          <BookingTab bookings={rejectedBookings} />
        </Tab>/>
      </Tabs>
    )
  }
}



const BookingTab = ({bookings}) => {
  return (
    <ul className="booking-list">
      {bookings}
    </ul>
  )
}

export const Booking = ({eventName, bandName, from, bandFee, bookingState, concertKey}) => {

  const handleBooking = (concert, isAcceptedByBookingBoss) => {
    const db = firebase.database().ref()
    const concertRef = db.child(`concerts/${concert}`)
    concertRef.once("value").then(snap => {
      const {scene} = snap.val()
      concertRef.child('isAcceptedByBookingBoss').set(isAcceptedByBookingBoss)
      const sceneConcertsRef = db.child(`scenes/${scene}/concerts`)
      sceneConcertsRef.once('value').then(snap => {
        const concerts = snap.val()
        concerts.push(concert)
        sceneConcertsRef.set(concerts)
      })
    })
  }

  let bookingStateAction = <div>
    <RaisedButton className="accept-button" label="Accept" primary onClick={(id, isAccepted) => handleBooking(concertKey, true)}/>
    <RaisedButton label="Reject" secondary onClick={(id, isAccepted) => handleBooking(concertKey, false)}/>
  </div>
  let icon = "bookmark_border"
  let color = ""
  if (bookingState === true) {
    bookingStateAction = "Accepted"
    icon = "done"
    color = "green"
  } else if (bookingState === false) {
    bookingStateAction = "Rejected"
    icon = "clear"
    color = "red"
  }
  return (
    <li>
      <div className="mdl-card mdl-shadow--2dp">
        <div className="booking-body mdl-card__title mdl-card--expand">
          <span className="booking-bg"/>
          <h4>{bandName} <br/>@<br/></h4>
          <h5>
            {eventName} <br/>
            {parseDate(from)} - {parseTime(from)}
            <br/>
            {parsePrice(bandFee)}
          </h5>
        </div>
        <div className="booking-footer mdl-card__actions mdl-card--border">
          {bookingStateAction}<div className="mdl-layout-spacer"></div>
          <i className={`material-icons ${color}`}>{icon}</i>
        </div>
      </div>
    </li>
  )
}
