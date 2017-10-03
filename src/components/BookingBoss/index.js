import React, { Component } from 'react'
import firebase from 'firebase'
import Drawer from 'material-ui/Drawer'
import Badge from 'material-ui/Badge'
import RaisedButton from 'material-ui/RaisedButton'
import MenuItem from 'material-ui/MenuItem'
import BookingTabSwipe from './BookingTabSwipe'
import {parseDate, parseTime} from '../../utils'


export default class BookingBoss extends Component {
  constructor() {
    super()
    this.state = {
      concerts: {},
      bands: {}
    }
  }


  componentDidMount() {
    const db = firebase.database().ref()
    const concertsRef = db.child('concerts')
    const bandsRef = db.child('bands')
    const eventsRef = db.child('events')
    const scenesRef = db.child('scenes')

    eventsRef.on('value', snap => {
      const events = snap.val()
      Object.keys(events).forEach(eventKey => {
        const event = events[eventKey]
        const {name} = event
        if (event.staff.bookingBoss.includes(this.props.user.uid)) {
          const {scenes} = event
          scenes.forEach(sceneKey => {
            scenesRef.child(sceneKey).on('value', snap => {
              const {concerts} = snap.val()
              concerts.forEach(concertKey => {
                concertsRef.child(concertKey).on('value', snap => {
                  const concert = snap.val()
                  concert.eventName = name

                  this.setState(prevState => ({
                    concerts: {
                      ...prevState.concerts,
                      [concertKey]: concert
                    }
                  }))
                })
              })
            })
          })
        } else {
          delete events[eventKey]
        }
      })
    })

    bandsRef.on('value', snap => {
      this.setState({
        bands: snap.val()
      })
    })
  }

  render() {
    const {isDrawerOpened, toggleDrawer} = this.props
    const {bands, concerts} = this.state
    const unhandledBookings = []
    let unhandledCounter = 0
    const acceptedBookings = []
    let acceptedCounter = 0
    const rejectedBookings = []
    let rejectedCounter = 0
    Object.keys(concerts).forEach(key => {
      const concert = concerts[key]
      const {eventName, band, ticketPrice, from, isAcceptedByBookingManager, isAcceptedByBookingBoss} = concert
      const bandName = bands[band] && bands[band].name
      const booking = <Booking
        key={key}
        {...{eventName, bandName, from, ticketPrice}}
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
      <div id="booking-boss">
        <Drawer
          docked={false}
          open={isDrawerOpened}>
          <MenuItem onClick={() => toggleDrawer()} primaryText={
            <div>
              Bookings Overview
              <Badge
                badgeContent={unhandledCounter}
                secondary={true}
                badgeStyle={{top: 18, right: 6}}
              />
            </div>
          }>

          </MenuItem>
        </Drawer>
        <BookingTabSwipe {...{unhandledCounter, unhandledBookings, acceptedCounter, acceptedBookings, rejectedCounter, rejectedBookings}}/>
      </div>
    )
  }
}


const Booking = ({eventName, bandName, from, ticketPrice, bookingState, concertKey}) => {

  const handleBooking = (concert, isAccepted) => {
    const db = firebase.database().ref()
    db.child(`concerts/${concert}/isAcceptedByBookingBoss`).set(isAccepted)
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
            {ticketPrice} NOK
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
