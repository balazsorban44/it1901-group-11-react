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
    this.setState({concerts: snap.val()})
  })

}

//change page to display after item in left menui is clicked
handleMenuItemClick(openedMenuItem){
  this.props.toggleDrawer()
  this.setState({openedMenuItem})
}

  render() {

    const {isDrawerOpened} = this.props
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
            <Search {...{bands, concerts}}/>,
            "previousConcerts":
            <PreviousConcerts {...{concerts, events, bands}}/>,
          }[openedMenuItem]}

        </div>
    )}
}
