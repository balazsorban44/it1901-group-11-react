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
      bands: {},
      // initializing local concerts
      // BUG: When search is the default openedMenuItem, search does not work.
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
        const {scenes, name} = event
        this.setState(({events}) => ({
          events: {
            ...events,
            [eventKey]: event
          }
        }))
        scenes.forEach(sceneKey => {
          scenesRef.child(sceneKey).on('value', snap => {
            const scene = snap.val()
            const {concerts} = scene
            this.setState(({scenes}) => ({
              scenes: {
                ...scenes,
                [sceneKey]: scene
              }
            }))
            concerts.forEach(concertKey => {
              concertsRef.child(concertKey).on('value', snap => {
                let concert = snap.val()
                const {band} = concert
                bandsRef.child(band).on('value', snap => {
                  const {genre} = snap.val()
                  concert.genre = genre
                  concert.eventName = name
                  this.setState(({bands, concerts}) => ({
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
