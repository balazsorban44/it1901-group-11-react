import React, { Component } from 'react'
import firebase from 'firebase'
import MenuItem from 'material-ui/MenuItem'
import DropDownMenu from 'material-ui/DropDownMenu';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import {parseDate} from '../../utils'

import Staff from './Staff'
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
            staffRef.child(`${roleMember}`).on('value', snap => {
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
                  this.setState({events, value: Object.keys(events)[0]})
                })
              })
            })
          })
        })
      })
    })
  }

  handleChange(event, index, value) {this.setState({value})}

  render() {
    const {events, value} = this.state
    return (
        <div>
          <Toolbar>
            <ToolbarGroup>
              <DropDownMenu value={value} onChange={this.handleChange}>
                {Object.keys(events).map(key => {
                  const {name} = events[key]
                  return <MenuItem key={key} value={key} primaryText={name}/>
                })}
              </DropDownMenu>
            </ToolbarGroup>
            <ToolbarGroup >
              <span>
                {
                  events[value] ?
                  `${parseDate(events[value].from)} - ${parseDate(events[value].to)}`:
                    "Loading..."
                }
              </span>
            </ToolbarGroup>
          </Toolbar>
          {
            events[value] ?
              <EventView event={events[value]}/> :
              <div className="mdl-spinner mdl-js-spinner is-active"/>
          }
        </div>
    )
  }
}



const EventView = ({event: {name, scenes, staff}}) =>  (
  <div className="event">
    <Staff staff={staff}/>
    <Scenes scenes={scenes}/>
  </div>
)
