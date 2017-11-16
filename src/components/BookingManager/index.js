import React, { Component } from 'react'
import firebase from 'firebase'
import Search from './Search'
import NewBooking from './NewBooking'
// import PreviousConcerts from './PreviousConcerts'

/**
* This is the BookingManager Component
*/

export default class BookingManager extends Component {

  /**
  * BookingManager constructor
  */

  constructor() {
    super()

    /**
    * Contain data that may change over time
    * @type {Object} state
    * @property {Object} state.events
    * @property {Object} state.scenes
    * @property {Object} state.concerts
    * @property {Object} state.technicians
    * @property {Object} state.bands
    * @property {Array} state.bandKeys
    * @property {String} state.openedMenuItem
    */

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

/**
* Fetch and Validate Data
*/

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
