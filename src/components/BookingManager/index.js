import React, { Component } from 'react'
import firebase from 'firebase'
import Search from './Search'
import NewBooking from './NewBooking'
// import PreviousConcerts from './PreviousConcerts'


export default class BookingManager extends Component {
  constructor() {
    super()
    this.state = {
      events: null,
      scenes: {},
      concerts: {},
      technicians: {},
      bands: null,
      bandKeys: [],
      openedMenuItem: "search"
    }
  }

// Fetching content from firebase
componentDidMount(){

  const db = firebase.database().ref()
  const eventsRef = db.child('events')
  const scenesRef = db.child('scenes')
  const concertsRef = db.child('concerts')
  const bandsRef = db.child('bands')
  const profilesRef = db.child('staff/profiles')

  eventsRef.on('value', snap => {
    const events = snap.val()
    Object.keys(events).forEach(eventKey => {
      const event = events[eventKey]
      if (event.staff.bookingManager.includes(this.props.user.uid)) {
        if (Date.now() <= event.from) {
          this.setState(({upcomingEvents}) => ({
            upcomingEvents: {
              ...upcomingEvents,
              [eventKey]: event
            }
          }))
        } else {
          this.setState(({previousEvents}) => ({
            previousEvents: {
              ...previousEvents,
              [eventKey]: event
            }
          }))
        }
      }
    })
  })

  bandsRef.on('value', snap => this.setState({bands: snap.val()}))

  scenesRef.on('value', snap => this.setState({scenes: snap.val()}))

  concertsRef.on('value', snap => {
    const concerts = snap.val()
    Object.keys(concerts).forEach(key => {
      const concert = concerts[key]
      const {technicians} = concert
      // TODO: Remove
      // Object.keys(technicians).forEach(technicianKey => {
      //   eventsRef.child(`${event}/staff/technician`).once('value', snap => {
      //     eventsRef.child(`${event}/staff/technician`).set([technicianKey, ...snap.val()])
      //   })
      // })
      //
      Object.keys(technicians).forEach((technicianKey, i) => {
        profilesRef.child(technicianKey).on('value', snap => {
          if (i === 0) {
            concerts[key].contact = `${snap.val().img}@tech.com`
          }
          this.setState(({technicians}) => ({
            technicians: {
              ...technicians,
              [technicianKey]: snap.val()
            }
          }))
        })
      })
    })
    this.setState({concerts})
  })
}

//change page to display after item in left menui is clicked
handleMenuItemClick(openedMenuItem){
  this.props.toggleDrawer()
  this.setState({openedMenuItem})

  /////////////////////////////////// TODO: eventuallly remove
  // const {events, scenes, concerts} = this.state
  // Object.keys(events).forEach(eventKey => {
  //   events[eventKey].scenes.forEach(sceneKey => {
  //     scenes[sceneKey].concerts.forEach(concertKey => {
  //       firebase.database().ref(`concerts/${concertKey}/event`).set(eventKey)
  //       firebase.database().ref(`concerts/${concertKey}/scene`).set(sceneKey)
  //     })
  //   })
  // })
  ///////////////////////////////////
}

  render() {
    const {user: {name}} = this.props
    const {
      bands, concerts, upcomingEvents, previousEvents, scenes, technicians
    } = this.state

    const events = upcomingEvents && previousEvents && Object.assign({}, upcomingEvents, previousEvents)

    const upcomingScenes = {}
    Object.keys(scenes).forEach(sceneKey => {
      Object.keys(upcomingEvents).forEach(upcomingEventKey => {
        if (upcomingEvents[upcomingEventKey].scenes.includes(sceneKey)) {
          upcomingScenes[sceneKey] = scenes[sceneKey]
        }
      })
    })
    return (
        <div className="booking-manager role">
          <NewBooking
            events={upcomingEvents}
            scenes={upcomingScenes}
            {...{bands, technicians}}
          />
          <Search {...{bands, concerts, name, scenes, events}}/>
        </div>
    )}
}
