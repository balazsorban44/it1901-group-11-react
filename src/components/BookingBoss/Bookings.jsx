import React, { Component } from 'react'

import {Tabs, Tab} from 'material-ui/Tabs'
import RaisedButton from 'material-ui/RaisedButton'
import firebase from 'firebase'
import {parseDate, parseTime, parsePrice, Loading} from '../../utils'

import Moment from 'moment'
import { extendMoment } from 'moment-range'


/**
  * Create an instance of Moment.js
  */
const moment = extendMoment(Moment)


/**
  * Bookings component
  */
export default class Bookings extends Component {

  /**
    * Display bookings divided into three category, awating, accepted, rejected
    * @return {JSX} Return bookings divided into three category, awating, accepted, rejected
    */
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


/**
  * Display one tab of bookings
  * @param {Object} props
  * @param {Object} props.bookings - List of bookings
  * @return {JSX} Return one tab of bookings
  */
const BookingTab = ({bookings}) => {
  return (
    <ul className="booking-list">
      {bookings}
    </ul>
  )
}


/**
  * Display a booking
  * @param {Object} props
  * @param {String} props.eventName - Name of the event
  * @param {String} props.bandName - Name of the band
  * @param {Date} props.from - Start date of the event
  * @param {number} props.bandFee - Cost of the band
  * @param {Object} props.bookingState
  * @param {String} props.concertKey - ID of the concert
  * @return {JSX} Return a booking
  */
export const Booking = ({eventName, bandName, from, bandFee, bookingState, concertKey}) => {

  /**
    * Check if the booking time range does not crash with an existing concert.
    * @param {Object} scene - ID of the scene of the concert
    * @param {Moment} concertTimeRange - The range of the concert
    * @return {Boolean} Whether the concert overlaps with an existing concert or not
    */
  const validateBooking = (scene, concertTimeRange) => {
    const db = firebase.database()
    const sceneRef = db.ref(`scenes/${scene}`)
    let promises = []
    return new Promise((resolve, reject) => {
      sceneRef.once('value', snap => {
        const {concerts} = snap.val()
        concerts.forEach(concertKey => {
          promises.push(db.ref(`concerts/${concertKey}`).once('value').then(snap => {
            const {scene: currentScene} = snap.val()
            if (currentScene === scene) {
              const {from, to} = snap.val()
              const existingConcertTimeRange = moment.range(new Date(from), new Date(to))
              return concertTimeRange.overlaps(existingConcertTimeRange)
            }
            return false
          }))
        })
      }).then(() => {
        resolve(Promise.all(promises).then(result => result.some(e => e)))
      })
    })
  }


  /**
    * Validate and write a booking to the database
    * @param {Object} concert - ID of the concert
    * @param {Boolean} isAcceptedByBookingBoss - Is the booking accepted or rejected by the booking boss
    
    */
  const handleBooking = (concert, isAcceptedByBookingBoss) => {
    const db = firebase.database()
    const concertRef = db.ref(`concerts/${concert}`)
    concertRef.once("value").then(snap => {
      const {scene, band, from, to} = snap.val()
      const concertTimeRange = moment.range(new Date(from), new Date(to))

      validateBooking(scene, concertTimeRange)
        .then(isConcertCrash => {
          if (!isConcertCrash || !isAcceptedByBookingBoss) {
            if (isAcceptedByBookingBoss) {
              // Update band.concerts list.
              const bandConcertsRef = db.ref(`bands/${band}/concerts`)
              bandConcertsRef.once('value').then(snap => {
                const concerts = snap.val()
                concerts.push(concert)
                bandConcertsRef.set(concerts)
              })
              // Update scenes/concerts list.
              const sceneConcertsRef = db.ref(`scenes/${scene}/concerts`)
              sceneConcertsRef.once('value').then(snap => {
                const concerts = snap.val()
                concerts.push(concert)
                sceneConcertsRef.set(concerts)
              })

            }
            // Update isAcceptedByBookingBoss boolean.
            concertRef.child('isAcceptedByBookingBoss').set(isAcceptedByBookingBoss)
          } else {
            // REVIEW: Better error handling
            alert("This booking cannot be accepted, because it crashes with an existing concert. Please tell the booking manager.");
          }
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
