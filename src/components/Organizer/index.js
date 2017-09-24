import React, { Component } from 'react'
import firebase from 'firebase'

import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import {Tabs, Tab} from 'material-ui/Tabs'

export default class Organizer extends Component {
  constructor() {
    super()
    this.state = {
      events: {}
    }
  }
  componentDidMount() {
    const db = firebase.database().ref()
    const eventsRef = db.child('events')
    const scenesRef = db.child('scenes')
    const concertsRef = db.child('concerts')
    const bandsRef = db.child('bands')
    eventsRef.on('value', snap => {
      const events = snap.val()
      Object.keys(events).forEach(eventKey => {
        const event = events[eventKey]
        const {scenes} = event
        event.scenes = {}
        scenes.forEach(sceneKey => {
          scenesRef.child(sceneKey).on('value', snap => {
            const scene = snap.val()
            event.scenes[sceneKey] = scene
            const {concerts} = scene
            concerts.forEach(concertKey => {
              delete event.scenes[sceneKey].concerts
              scene.bands = []
              concertsRef.child(`${concertKey}/band`).on('value', snap => {
                const bandKey = snap.val()
                bandsRef.child(`${bandKey}/name`).on('value', snap => {
                  scene.bands.push(snap.val())
                })
              })
            })
          })
        })
      })
      this.setState({events})
    })
  }
  render() {
    const {events} = this.state
    const {user, isDrawerOpened, toggleDrawer} = this.props
    const {uid} = user
    let tabs = []

    Object.keys(events).forEach(key => {
      const event = events[key]
      const {from, to, name} = event
      tabs.push(
        <Tab key={from} label={event.name}>
          <div>
            <h3>{name}</h3>
            <date>{new Date(from).toISOString().slice(0, 10)}</date><span> - </span><date>{new Date(to).toISOString().slice(0, 10)}</date>
          </div>
        </Tab>
      )
    })

    return (
        <div>
          <Drawer
            open={isDrawerOpened}>
            <MenuItem onClick={() => toggleDrawer()} primaryText="Events Overview" />
          </Drawer>
          <Tabs>
            {tabs}
          </Tabs>
        </div>
    )
  }
}
