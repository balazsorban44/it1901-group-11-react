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
      concerts: {},
      bands: {},
      // initializing local concerts
      openedMenuItem: "previousConcerts"
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
        const {scenes, name} = event
        scenes.forEach(sceneKey => {
          scenesRef.child(sceneKey).on('value', snap => {
            const {concerts} = snap.val()
            concerts.forEach(concertKey => {
              concertsRef.child(concertKey).on('value', snap => {
                let concert = snap.val()
                const {band} = concert
                bandsRef.child(band).on('value', snap => {
                  const {genre} = snap.val()
                  concert.genre = genre
                  concert.eventName = name

                  this.setState(({concerts, bands}) => ({
                    concerts: {
                      ...concerts,
                      [concertKey]: concert
                    },
                    bands: {
                      ...bands,
                      [band]: snap.val()
                    }
                  }))
                })
              })
            })
          })
        })
      } else {
        delete events[eventKey]
      }
    })
  })

}

//change page to display after item in left menui is clicked
handleMenuItemClick(openedMenuItem){
  this.props.toggleDrawer()
  this.setState({openedMenuItem})
}

  render() {
    const {isDrawerOpened} = this.props
    const {openedMenuItem, bands, concerts} = this.state
    return (
        <div id="booking-manager">
          <Drawer open={isDrawerOpened}>
            <MenuItem onClick={() => this.handleMenuItemClick("newBooking")} primaryText="New booking" />
            <MenuItem onClick={() => this.handleMenuItemClick("search")} primaryText="Search" />
            <MenuItem onClick={() => this.handleMenuItemClick("previousConcerts")} primaryText="Previous concerts" />
          </Drawer>
          <NewBooking {...{bands}}/>
          {{
            "search":
            <Search {...{bands, concerts}}/>,
            "previousConcerts":
            <PreviousConcerts {...{concerts}}/>,
          }[openedMenuItem]}

        </div>
    )}
}
