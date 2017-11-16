import React, { Component } from 'react'
import firebase from 'firebase'
import Concerts from './Concerts'
import {NoResult} from '../../utils'

/**
* This is the Technician Component
*/

export default class Technician extends Component {

  /**
  * Technician constructor
  */

  constructor() {
    super()

    /**
    * Contain data that may change over time
    * @type {Object} state
    * @property {Object} state.concerts
    * @property {Object} state.bands
    * @property {Object} state.scenes
    * @property {Object} state.events
    * @property {String} state.openedMenuItem
    */

    this.state = {
      concerts: null,
      bands: null,
      scenes: null,
      events: null,
      openedMenuItem: "concertsOverview"
    }
  }

  /**
  * Fetch and Validate data
  */

  componentDidMount() {

    const db = firebase.database().ref()
    const concertsRef = db.child('concerts')
    const bandsRef = db.child('bands')
    const eventsRef = db.child('events')
    const scenesRef = db.child('scenes')

    concertsRef.on('value', snap => {
      const concerts = snap.val()
      Object.keys(concerts).forEach(concertKey => {
        const {technicians, isAcceptedByBookingBoss} = concerts[concertKey]
        if (Object.keys(technicians).includes(this.props.user.uid) && isAcceptedByBookingBoss === true){
          const concert = concerts[concertKey]
          if (Date.now() <= concert.from) {
            scenesRef.on('value', snap => {
              const scenes = snap.val()
              Object.keys(scenes).forEach(sceneKey => {
                if (scenes[sceneKey].concerts.includes(concertKey)){
                  const sceneName = scenes[sceneKey].name
                  eventsRef.on('value', snap => {
                    const events = snap.val()
                    Object.keys(events).forEach(eventKey => {
                      if (events[eventKey].scenes.includes(sceneKey)) {
                        concert.location = events[eventKey].location
                        bandsRef.child(concerts[concertKey].band).on('value', snap => {
                          const {name, technicalRequirements} = snap.val()
                          concert.sceneName = sceneName
                          concert.bandName = name
                          concert.technicalRequirements = technicalRequirements
                          let concerts = this.state.concerts ? this.state.concerts : {}
                          concerts[concertKey] = concert
                          this.setState({concerts})
                        })
                      }
                    })
                  })
                }
              })
            })
          }
        } else delete concerts[concertKey]
      })
    })
  }

  /**
    * Display Technician
    * @return {JSX} Return Technician
    */
  render(){
    const {concerts} = this.state
    const {name, uid: technicianId} = this.props.user
    return (
      <div className='technician role'>
        {concerts ?
          <Concerts {...{concerts, technicianId}}/> :
          <NoResult text={`${name} has no upcoming concerts.`}/>
        }
      </div>
    )
  }
}
