import React, { Component } from 'react'
import firebase from 'firebase'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import Search from './Search'
import NewBooking from './NewBooking'
import PreviousConcerts from './PreviousConcerts'


export default class BookingManager extends Component {
  constructor() {
    super()
    this.state = {
      events: {},
      scenes: {},
      concerts: {},
      bands: null,
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
        this.setState(({events}) => ({
          events: {
            ...events,
            [eventKey]: event
          }
        }))
      } else {
        delete events[eventKey]
      }
    })
  })

  bandsRef.on('value', snap => {
    this.setState({bands: snap.val()})
  })
  scenesRef.on('value', snap => {
    this.setState({scenes: snap.val()})
  })
  concertsRef.on('value', snap => {
    const concerts = snap.val()
    Object.keys(concerts).forEach(key => {
      const concert = concerts[key]
      const {staff} = concert
      profilesRef.child(staff[0]).on('value', snap => {
        concerts[key].staff[0] = `${snap.val().img}@tech.com`
      })
    })
    this.setState({concerts})
  })
}

//change page to display after item in left menui is clicked
handleMenuItemClick(openedMenuItem){
  this.props.toggleDrawer()
  this.setState({openedMenuItem})
  /////////////////////////////////// TODO eventuallly remove
  // const events = this.state.events
  // const scenes = this.state.scenes
  // const concerts = this.state.concerts
  //
  // Object.keys(scenes).forEach(sceneKey =>{
  //   const sceneId = sceneKey
  //   Object.keys(scenes[sceneKey]['concerts']).forEach(concertKey =>{
  //     const concertId = scenes[sceneKey]['concerts'][concertKey]
  //
  //     const db = firebase.database().ref()
  //     const concertsRef = db.child('concerts')
  //     const concertRef = concertsRef.child(concertId)
  //     concertRef.once('value').then(snap => {
  //     if (snap.val().scene) {
  //         console.log("Exist")
  //        return
  //      } else {
  //        console.log(sceneId)
  //        console.log("not there")
  //        concertRef.child('scene').set(sceneId)
  //       }
  //     })
  //
  //   })
  // })
  // Object.keys(events).forEach(eventKey =>{
  //   const eventName = events[eventKey]['name']
  //   const eventId = eventKey
  //   Object.keys(events[eventKey]['scenes']).forEach(sceneKey =>{
  //     const sceneId = events[eventKey]['scenes'][sceneKey]
  //     console.log(scenes[sceneId])
  //
  //     const db = firebase.database().ref()
  //     const scenesRef = db.child('scenes')
  //     const sceneRef = scenesRef.child(sceneId)
  //     sceneRef.once('value').then(snap => {
  //     if (snap.val().event) {
  //         console.log("Exist")
  //        return
  //      } else {
  //        console.log(events[eventId]['name'])
  //        console.log("not there")
  //        //sceneRef.child('event').set(eventId)
  //       }
  //     })
  //
  //   })
  // })
  ///////////////////////////////////
}

  render() {

    const {isDrawerOpened, user: {name}} = this.props
    const {openedMenuItem, bands, concerts, events, scenes} = this.state

    return (
        <div className="booking-manager role">
          <Drawer open={isDrawerOpened}>
            <MenuItem onClick={() => this.handleMenuItemClick("search")} primaryText="Search" />
            <MenuItem onClick={() => this.handleMenuItemClick("previousConcerts")} primaryText="Previous concerts" />
          </Drawer>
          <NewBooking {...{bands, events, scenes}}/>
          {{
            "search":
            <Search {...{bands, concerts, name, scenes, events}}/>,
            "previousConcerts":
            <PreviousConcerts {...{concerts, events, bands, scenes}}/>,
          }[openedMenuItem]}

        </div>
    )}
}
