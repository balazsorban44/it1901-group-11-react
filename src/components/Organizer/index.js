import React, { Component } from 'react'
import firebase from 'firebase'
import MenuItem from 'material-ui/MenuItem'
import DropDownMenu from 'material-ui/DropDownMenu'
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar'
import {Loading} from '../../utils'
import EventInfo from './EventInfo'
import Scenes from './Scenes'

export default class Organizer extends Component {
  constructor() {
    super()
    this.state = {
      events: {},
      value: 1
    }
  }

  componentDidMount() {
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
        if (event.staff.organizer.includes(this.props.user.uid)) {
            // Fetch event staff information
          const {staff} = event
          Object.keys(staff).forEach(roleKey => {
            const roleMembers = staff[roleKey]
            staff[roleKey] = []
            roleMembers.forEach(roleMember => {
              profilesRef.child(`${roleMember}`).on('value', snap => {
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
                concertsRef.child(concertKey).on('value', snap => {
                  let {band, from, to, technicians} = snap.val()            
                  Object.keys(technicians).forEach(technicianKey => {
                    profilesRef.child(technicianKey).on('value', snap => {
                      technicians[technicianKey].name = snap.val().name
                    })
                  })
                  bandsRef.child(`${band}/name`).on('value', snap => {
                    scene.bands.push({
                      name: snap.val(), from, to,
                      technicians: {
                        ...technicians
                      }})
                    this.setState({events, value: Object.keys(events)[0]})
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

  handleChange = (event, index, value) => this.setState({value})

  render() {
    const {events, value} = this.state
    return (
        <div className="organizer role">
          <Toolbar>
            <ToolbarGroup>
              <DropDownMenu value={value} onChange={this.handleChange}>
                {Object.keys(events).map(key => (
                  <MenuItem
                    key={key}
                    value={key}
                    primaryText={events[key].name}
                  />))
                }
              </DropDownMenu>
            </ToolbarGroup>
          </Toolbar>
          {
            events[value] ? <EventView event={events[value]}/> : <Loading/>
          }
        </div>
    )
  }
}

const EventView = ({event}) =>  {
  const {scenes, staff, from} = event
  return (
    <div className="event">
      <EventInfo event={event} staff={staff}/>
      <Scenes eventStart={from} scenes={scenes}/>
    </div>
  )
}
