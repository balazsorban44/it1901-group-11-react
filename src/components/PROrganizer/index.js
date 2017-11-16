import React, { Component } from 'react'
import firebase from 'firebase'
import MenuItem from 'material-ui/MenuItem'
import DropDownMenu from 'material-ui/DropDownMenu'
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar'
import {Loading} from '../../utils'
import EventInfo from '../Organizer/EventInfo'
import Scenes from './Scenes'

/**
* This is the PROrganizer Component
*/

export default class PROrganizer extends Component {

  /**
  * PROrganizer constructor
  */

  constructor() {
    super()

    /**
    * Contain data that may change over time
    * @type {Object} state
    * @property {Object} state.events
    * @property {number} state.value
    */

    this.state = {
      events: {},
      value: 1
    }
  }

  /**
  * Fetch and Validate data
  */

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
        if (event.staff.PROrganizer.includes(this.props.user.uid)) {
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
              const {concerts, size} = scene
              concerts.forEach(concertKey => {
                delete event.scenes[sceneKey].concerts
                scene.bands = []
                concertsRef.child(`${concertKey}`).on('value', snap => {
                  const {band, from, to, participants} = snap.val()
                  bandsRef.child(`${band}`).on('value', snap => {
                    scene.bands.push({size, participants, from, to,...snap.val()})
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


  /**
    * Handle click of event dropdown
    * @param {Object} Clicked element
    * @param {number} Clicked Event's index
    * @param {String} Clicked Event's ID
    */
  handleChange = (event, index, value) => this.setState({value})


  /**
    * Display PR Organizer
    * @return {JSX} Return PR Organizer
    */
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



/**
  * Display an event
  * @param {Object} props
  * @param {Object} props.event - Event
  * @return {JSX} Return an event
  */
const EventView = ({event}) =>  {
  const {scenes, staff, from} = event
  return (
    <div className="event">
      <EventInfo event={event} staff={staff}/>
      <Scenes eventStart={from} scenes={scenes}/>
    </div>
  )
}
