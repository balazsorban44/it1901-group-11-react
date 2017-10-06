import React, { Component } from 'react'
import Drawer from 'material-ui/Drawer'
import Badge from 'material-ui/Badge'
import MenuItem from 'material-ui/MenuItem'
import Bookings, {Booking} from './Bookings'
import firebase from 'firebase'


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
      <div className="booking-boss role">
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
        <Bookings {...{unhandledCounter, unhandledBookings, acceptedCounter, acceptedBookings, rejectedCounter, rejectedBookings}}/>
      </div>
    )
  }
}
