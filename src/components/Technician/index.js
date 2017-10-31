import React, { Component } from 'react'
import firebase from 'firebase'
import Drawer from 'material-ui/Drawer'
import Paper from 'material-ui/Paper'
import MenuItem from 'material-ui/MenuItem'
import {List} from 'material-ui/List'
import {parseDate, parseTime, Loading, InfoSnippet} from '../../utils'

// 13.  Som lyd eller lystekniker skal jeg kunne få opp en oversikt over
// konserter jeg skal jobbe med.

// TODO: ID26	Som tekniker så vil jeg kunne melde fra om oppmøte på rigging til konserter

export default class Technician extends Component {
  constructor() {
    super()
    this.state = {
      // initializing local concerts
      concerts:{},
      bands:{},
      // NOTE: Might not be nessecary, added to get scenes and events
      // REVIEW : Does Technician need all this information???
      scenes:{},
      events:{},
      openedMenuItem: "concertsOverview"
    }
  }


  componentDidMount(){
    const db = firebase.database().ref()
    const concertsRef = db.child('concerts')
    const bandsRef = db.child('bands')
    const eventsRef = db.child('events')
    const scenesRef = db.child('scenes')

    concertsRef.on('value', snap => {
      const concerts = snap.val()
      Object.keys(concerts).forEach(concertKey => {
        const {staff, isAcceptedByBookingBoss} = concerts[concertKey]
        if (staff.includes(this.props.user.uid) && isAcceptedByBookingBoss === true){
          //TODO time filter
          if (true){
            const concert = concerts[concertKey]
            scenesRef.on('value', snap => {
              const scenes = snap.val()
              Object.keys(scenes).forEach(sceneKey => {
                if (scenes[sceneKey].concerts.includes(concertKey)){
                  const sceneName = scenes[sceneKey].name
                  eventsRef.on('value', snap => {
                    const events = snap.val()
                    Object.keys(events).forEach(eventKey => {
                      if (events[eventKey].scenes.includes(sceneKey)){
                        concert.location = events[eventKey].location
                        bandsRef.child(concerts[concertKey].band).on('value', snap => {
                          const {name, technicalRequirements} = snap.val()
                          concert.sceneName = sceneName
                          concert.bandName = name
                          concert.technicalRequirements = technicalRequirements
                          let prevState = this.state.concerts
                          prevState[concertKey] = concert
                          this.setState({concerts: prevState})
                        })
                      }
                    })
                  })
                }
              })
            })
          }else{
            
          }
        } else{
          delete concerts[concertKey]
        }
      })
    })
  }



handleMenuItemClick(openedMenuItem){
  this.props.toggleDrawer()
  this.setState({openedMenuItem})
}

  render(){

    const {isDrawerOpened} = this.props
    // REVIEW: the scenes
    const {concerts} = this.state

    return (
        <div className='technician role'>
          <Drawer open={isDrawerOpened}>
            <MenuItem onClick={() => this.handleMenuItemClick("concertsOverview")} primaryText='Concerts Overview' />
          </Drawer>

          {/* Switch-case to toggle MenuItem */}

          {/* This is the place the information will be rendered */}
          {{
            "concertsOverview":

            <ConcertsOverview{...{concerts}}/>

          }[this.state.openedMenuItem]}
        </div>
    )
  }
}




// function ConcertsOverview({concerts, bands}) {
  // NOTE: This one or the one below? Welp, the arrow means they are the same?

const ConcertsOverview = ({concerts}) => {
  const concertBandsList = []



// TODO: get location from db, and add to list
  Object.keys(concerts).forEach(key =>{
    const {from, to, location, bandName, sceneName} = concerts[key]
    const technicalRequirements = concerts[key].technicalRequirements.join(", ")

    // NOTE: uncomment to log info to console
    // console.log("concerts: ", concerts,"bands: ", bands /* ,"scenes: ",scenes*/);

    concertBandsList.push(
      <li key={key} className="concert-list-item">
        <Paper>
          <h2>{bandName}</h2>
          <List>
            <InfoSnippet icon="date_range" subText="Date">{parseDate(from)}</InfoSnippet>
            <InfoSnippet icon="access_time" subText="Start/end">{parseTime(from)} - {parseTime(to)}</InfoSnippet>
            <InfoSnippet icon="settings_input_component" subText="Technical requirements">{technicalRequirements}</InfoSnippet>
            <InfoSnippet icon="account_balance" subText="Scene">{sceneName}</InfoSnippet>
            <InfoSnippet icon="place" subText="Location">{location}</InfoSnippet>
          </List>
        </Paper>
      </li>
    )

  })




  //Return statement for ConcertsOverview
  return(
    <div>
      {concertBandsList.length > 0 ?
        <ul className="concert-list">
          {concertBandsList}
        </ul> :
        <Loading/>
      }
    </div>

  )

}
