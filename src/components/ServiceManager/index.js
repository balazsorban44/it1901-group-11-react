import React, { Component } from 'react'
import firebase from 'firebase'
import Scenes from './Scenes'
import {Loading} from '../../utils'


/**
* This is the Service Manager Component
*/

export default class ServiceManager extends Component {

  /**
  * ServiceManager constructor
  */
  constructor() {
    super()

    /**
    * Contain data that may change over time
    * @type {Object} state
    * @property {Object} state.events - contains events from database
    * @property {Object} state.concerts - contains concerts from database
    * @property {Object} state.scenes - contains scenes from database
    * @property {Object} state.bands - contains bands from database
    */

    this.state = {
      events: {},
      concerts: {},
      scenes: {},
      bands: {}
    }
  }

  /**
  * Fetch and validate data
  * @return {undefined}
  */

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
                concertsRef.child(`${concertKey}`).on('value', snap => {
                  const {band, from, to, participants} = snap.val()
                  bandsRef.child(`${band}`).on('value', snap => {
                    scene.bands.push({ from, to, participants, ...snap.val()})
                    this.setState({events, value: Object.keys(events)[0]} )
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
  *
  * @return {JSX} return Scenes
  */

  render() {
    const {events, value} = this.state
    return(
      <div className="ServiceManager role">
        {
          events[value] ? <SceneView event={events[value]}/> : <Loading/>
        }
      </div>
    )
  }
}

/**
* Connect Scenes to the main ServiceManager component
* @param {Object} props
* @param {Object} props.event - event information
* @return {JSX} Div containing Scenes from Scenes.jsx
*/

const SceneView = ({event}) =>  {
  const {scenes, from} = event
  return (
    <div className="scenes">
      <Scenes eventStart={from} scenes={scenes}/>
    </div>
  )
}
