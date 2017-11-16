import React, { Component } from 'react'
import Bookings, {Booking} from './Bookings'
import firebase from 'firebase'

/**
* This is the BookingBoss Component
*/

export default class BookingBoss extends Component {

  /**
  * BookingBoss constructor
  */

  constructor() {
    super()

    /**
    * Contain data that may change over time
    * @type {Object} state
    * @property {Object} state.concerts
    * @property {Object} state.bands
    */

    this.state = {
      concerts: {},
      bands: {}
    }
  }

/**
* Fetch and Validate data
*/

  componentDidMount() {
    const db = firebase.database().ref()
    const concertsRef = db.child('concerts')
    const bandsRef = db.child('bands')
    const eventsRef = db.child('events')



    let concerts = {}
    concertsRef.on('value', snap => {
      concerts = snap.val()
      Object.keys(concerts).forEach(concertKey => {
        const concert = concerts[concertKey]
        const {event} = concert
        eventsRef.child(event).on('value', snap => {
          concert.eventName = snap.val().name
          if (!snap.val().staff.bookingBoss.includes(this.props.user.uid)) {
            delete concerts[concertKey]
            this.setState({concerts})
          }
        })
      })
    })


    bandsRef.on('value', snap => {
      this.setState({
        bands: snap.val()
      })
    })
  }

  /**
    * Display the Booking Boss
    * @return {JSX} Return the Booking Boss
    */
  render() {
    const {bands, concerts} = this.state
    const unhandledBookings = []
    let unhandledCounter = 0
    const acceptedBookings = []
    let acceptedCounter = 0
    const rejectedBookings = []
    let rejectedCounter = 0
    Object.keys(concerts).forEach(key => {
      const concert = concerts[key]
      const {eventName, band, bandFee, from, isAcceptedByBookingManager, isAcceptedByBookingBoss} = concert
      const bandName = bands[band] && bands[band].name
      const booking = <Booking
        key={key}
        {...{eventName, bandName, from, bandFee}}
        concertKey={key}
        bookingState={isAcceptedByBookingBoss}
                      />
      if (isAcceptedByBookingManager) {
        if (isAcceptedByBookingBoss==="unhandled") {
          unhandledBookings.push(booking)
          unhandledCounter+=1
        } else if (isAcceptedByBookingBoss) {
          acceptedBookings.push(booking)
          acceptedCounter+=1
        } else {
          rejectedBookings.push(booking)
          rejectedCounter+=1
        }
      }
    })
    return (
      <div className="booking-boss role">

        <Bookings {...{unhandledCounter, unhandledBookings, acceptedCounter, acceptedBookings, rejectedCounter, rejectedBookings}}/>
      </div>
    )
  }
}
