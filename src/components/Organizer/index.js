import React, { Component } from 'react'
import firebase from 'firebase'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import {Tabs, Tab} from 'material-ui/Tabs'

import StaffList from './StaffList'
import ScenesList from './ScenesList'



const parseDate = date => new Date(parseDate).toISOString().slice(0, 10)

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
    const staffRef = db.child('staff/profiles')


    eventsRef.on('value', snap => {
      const events = snap.val()
      Object.keys(events).forEach(eventKey => {
        const event = events[eventKey]

        // Fetch event staff information
        const {staff} = event
        Object.keys(staff).forEach(roleKey => {
          const roleMembers = staff[roleKey]
          staff[roleKey] = []
          roleMembers.forEach(roleMember => {
            staffRef.child(`${roleMember}/name`).on('value', snap => {
              staff[roleKey].push(snap.val())
            })
          })
        })

        // Fetch scenes information
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
                  this.setState({events})
                })
              })
            })
          })
        })
      })
    })

  }
  render() {
    const {events} = this.state
    const {isDrawerOpened, toggleDrawer} = this.props
    return (
        <div>
          <Drawer
            open={isDrawerOpened}>
            <MenuItem onClick={() => toggleDrawer()} primaryText="Events Overview" />
          </Drawer>
          <Tabs>
            {Object.keys(events).map(eventKey => {
              const event = events[eventKey]
              const {from, to, name, staff, scenes} = event
              return(
                <Tab key={from} label={name}>
                  <div>
                    <EventHeader className="event-header" {...{name, from, to}}/>
                    <div className="event-body">
                      <StaffList staff={staff}/>
                      <ScenesList scenes={scenes}/>
                    </div>
                  </div>
                </Tab>
              )
            })}
          </Tabs>
        </div>
    )
  }
}

const EventHeader = ({name, from, to}) => (
  <div>
    <h3>{name}</h3>
    <date>{parseDate(from)}</date><span> - </span><date>{parseDate(to)}</date>
  </div>
)
