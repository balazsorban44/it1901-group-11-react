import React, { Component } from 'react'
import firebase from 'firebase'
import Drawer from 'material-ui/Drawer'
import Paper from 'material-ui/Paper'
import MenuItem from 'material-ui/MenuItem'
import {List, ListItem} from 'material-ui/List';
import {parseDate, parseTime} from '../../utils'

// 13.  Som lyd eller lystekniker skal jeg kunne få opp en oversikt over konserter jeg skal jobbe med.
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


  componentDidMount() {
    const db = firebase.database().ref()
    const concertsRef = db.child('concerts')
    const bandsRef = db.child('bands')
    const eventsRef = db.child('events')
    const scenesRef = db.child('scenes')

    eventsRef.on('value', snap => {
      const events = snap.val()
      Object.keys(events).forEach(eventKey => {
        const event = events[eventKey]
        // TODO: Time filter, technician does not need to se earlier events
        if (true) {

          const {location, name, to, from} = event
          if (event.staff.technician.includes(this.props.user.uid)) {
            const {scenes} = event
            scenes.forEach(sceneKey => {
              scenesRef.child(sceneKey).on('value', snap => {
                const {concerts} = snap.val()
                concerts.forEach(concert => {
                  const concertRef = concertsRef.child(concert)
                  concertRef.once('value').then(snapshot => {
                    let now = snapshot.val()
                    now.location = location
                    if (now.staff.includes(this.props.user.uid) && now.isAcceptedByBookingBoss === true){
                      let pState = this.state.concerts
                      pState[concert] = now
                      this.setState({concerts: pState})
                    }

                  })

                  //REVIEW: Filter for concerts includes technician
                  // if (concerts[concertKey].staff.includes(this.props.user.uid)) {
                    // concertsRef.child(concertKey).on('value', snap => {
                    //   const concert = snap.val()
                    //   concert.eventName = name
                    //
                    //   this.setState(prevState => ({
                    //     concerts: {
                    //       ...prevState.concerts,
                    //       [concertKey]: concert
                    //     }
                    //   }))
                    // })
                  // }
                })
              })
            })
          }
          else {
            delete events[eventKey]
          }
        }
        //for time-filter
        else {
          delete events[eventKey]
        }
      })
    })

    bandsRef.on('value', snap => {
      this.setState({
        bands: snap.val()
      })
    })
  }




handleMenuItemClick(openedMenuItem){
  this.props.toggleDrawer()
  this.setState({openedMenuItem})
}

  render() {

    const {isDrawerOpened} = this.props
    // REVIEW: the scenes
    const {concerts, bands, scenes} = this.state

    return (
        <div className='Technicians-container'>
          <Drawer open={isDrawerOpened}>
            <MenuItem onClick={() => this.handleMenuItemClick("concertsOverview")} primaryText='Concerts Overview' />
          </Drawer>

          {/* Switch-case to toggle MenuItem */}

          {/* This is the place the information will be rendered */}
          {{
            "concertsOverview":

            <ConcertsOverview{...{concerts, bands}}/>

          }[this.state.openedMenuItem]}
        </div>
    )
  }
}




// function ConcertsOverview({concerts, bands}) {
  // NOTE: This one or the one below? Welp, the arrow means they are the same?

const ConcertsOverview = ({concerts, bands}) => {
  const concertBandsList = []
  console.log(concerts)



// TODO: get location from db, and add to list
  Object.keys(concerts).forEach(key =>{
    const {from, to, band, location} = concerts[key]

    // NOTE: scene
    let name, technicalRequirements, sceneName = null

    if (bands[band]) {
      name = bands[band].name
      technicalRequirements = bands[band].technicalRequirements.join(", ")
    }

    // NOTE: uncomment to log info to console
    // console.log("concerts: ", concerts,"bands: ", bands /* ,"scenes: ",scenes*/);

    concertBandsList.push(
      <ListItem key={key}>
        <h2>{name}</h2>

        <p><i className="material-icons">date_range</i>{parseDate(from)} - {parseDate(to)}</p>
        <p><i className="material-icons">access_time</i>{parseTime(from)} - {parseTime(to)}</p>
        <p><i className="material-icons">settings_input_component</i> Technical requirements: {technicalRequirements}</p>
        <p><i className="material-icons">place</i> Location: {location}</p>

      </ListItem>
    )

  })




  //Return statement for ConcertsOverview
  return(
    <Paper>

      <List>
        {concertBandsList}
      </List>
      {/*<p>mulige symbol: <i className="material-icons">grade</i>
      <i className="material-icons">build</i> <i className="material-icons">lightbulb_outline</i>
      <i className="material-icons">mic</i> <i className="material-icons">album</i>
      <i className="material-icons">attach_file</i> <i className="material-icons">attachment</i>
      <i className="material-icons">map</i> <i className="material-icons">power</i>
      <i className="material-icons">location_city</i> <i className="material-icons">whatshot</i>
      <i className="material-icons">group</i><i className="material-icons">terrain</i>
      <i className="material-icons">gps_fixed</i> <i className="material-icons">audiotrack</i>
      </p>*/}

    </Paper>
  )

}
