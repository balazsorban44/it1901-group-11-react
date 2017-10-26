import React, { Component } from 'react'
import firebase from 'firebase'

export default class ServiceManager extends Component {
  constructor() {
    super()
    this.state = {
      events: {},
      concerts: {},
      scenes: {},
      bands: {}
    }
  }

  componentDidMount() {
    const db = firebase.database().ref()
    const concertsRef = db.child('concerts')
    const eventsRef = db.child('events')
    const scenesRef = db.child('scenes')
    const bandsRef = db.child('bands')

    eventsRef.on('value', snap => {
      const events = snap.val()
      Object.keys(events).forEach(eventKey => {
        const event = events[eventKey]
        if (event.staff.serviceManager.includes(this.props.user.uid)){
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

  render() {

    const {events} = this.state
    console.log("events");

    return (
        <div>{JSON.stringify(events)}</div>
    )
  }
}

// ID15	Som ansvarlig for servering på konserter
// ønsker jeg å kunne se forventet publikumstall,
// start og slutt på en konsert, samt musikksjanger.

// ID16	Som ansvarlig for servering ønsker
// jeg å kunne beregne innkjøp av varer
// til barer på en scene for en gitt konsert.
