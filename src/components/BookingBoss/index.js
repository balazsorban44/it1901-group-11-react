import React, { Component } from 'react'
import firebase from 'firebase'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import {Tabs, Tab} from 'material-ui/Tabs'


const parseDate = date => new Date(date).toISOString().slice(0, 10)


export default class BookingBoss extends Component {
  constructor() {
    super()
    this.state = {
      concerts: {},
      bands: {}
    }
  }

  handleBooking(concert, isAccepted) {
    const db = firebase.database().ref()
    db.child(`concerts/${concert}/isAcceptedByBookingBoss`).set(isAccepted)
  }
  componentDidMount() {
    const db = firebase.database().ref()
    const concertsRef = db.child('concerts')
    const bandsRef = db.child('bands')
    concertsRef.on('value', snap => {
      this.setState({
        concerts: snap.val()
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
      const {band, ticketPrice, from, to, isAcceptedByBookingManager, isAcceptedByBookingBoss} = concert
      const bandName = bands[band] && bands[band].name
      if (isAcceptedByBookingManager) {
        if (isAcceptedByBookingBoss==="unhandled") {
          unhandledBookings.push(
            <li key={band}>
              <p>{bandName}</p>
              <p>{ticketPrice} NOK</p>
              <p>{parseDate(from)}</p>
              <p>{parseDate(to)}</p>
              <button onClick={(band, isAccepted) => this.handleBooking(key, true)}>Accept</button>
              <button onClick={(band, isAccepted) => this.handleBooking(key, false)}>Reject</button>
            </li>)
            unhandledCounter+=1
        } else if (isAcceptedByBookingBoss) {
          acceptedBookings.push(
            <li key={band}>
              <p>Accepted</p>
              <p>{bandName}</p>
              <p>{ticketPrice} NOK</p>
              <p>{parseDate(from)}</p>
              <p>{parseDate(to)}</p>
            </li>)
            acceptedCounter+=1
        } else {
          rejectedBookings.push(
            <li key={band}>
              <p>Rejected</p>
              <p>{bandName}</p>
              <p>{ticketPrice} NOK</p>
              <p>{parseDate(from)}</p>
              <p>{parseDate(to)}</p>
            </li>)
          rejectedCounter+=1
        }
      }
    })
    return (
        <div>
          <Drawer
            open={isDrawerOpened}>
            <MenuItem onClick={() => toggleDrawer()} primaryText="Bookings Overview" />
          </Drawer>
          <Tabs>
            <Tab label={`New bookings (${unhandledCounter})`}>
              <Bookings bookings={unhandledBookings}/>
            </Tab>
            <Tab label={`Accepted bookings (${acceptedCounter})`}>
              <Bookings bookings={acceptedBookings}/>
            </Tab>
            <Tab label={`Rejected bookings (${rejectedCounter})`}>
              <Bookings bookings={rejectedBookings} />
            </Tab>
          </Tabs>
        </div>
    )
  }
}


const Bookings = ({bookings}) => {
  return (
    <ul>
      {bookings}
    </ul>
  )
}
