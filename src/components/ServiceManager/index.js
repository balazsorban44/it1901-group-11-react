import React, { Component } from 'react'
import firebase from 'firebase'
import Scenes from './Scenes'
import {Loading} from '../../utils'

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

const SceneView = ({event}) =>  {
  const {scenes, from} = event
  return (
    <div className="scenes">
      <Scenes eventStart={from} scenes={scenes}/>
    </div>
  )
}

// ID16	Som ansvarlig for servering ønsker
// jeg å kunne beregne innkjøp av varer
// til barer på en scene for en gitt konsert.
