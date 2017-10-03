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

        const {location, name, time} = event
        if (event.staff.technician.includes(this.props.user.uid)) {
          const {scenes} = event
          scenes.forEach(sceneKey => {
            scenesRef.child(sceneKey).on('value', snap => {
              const {concerts} = snap.val()
              concerts.forEach(concertKey => {
                concertsRef.child(concertKey).on('value', snap => {
                  const concert = snap.val()
                  concert.eventName = name

                  this.setState(prevState => ({
                    concerts: {
                      ...prevState.concerts,
                      [concertKey]: concert
                    }
                  }))
                })
              })
            })
          })
        }
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


/*
// Fetching content from firebase
componentDidMount(){
  // referencing database (firebase) "ready up for connect"
  const db = firebase.database().ref()
  // accesing child of database = concerts
  const concertsRef = db.child('concerts')
  const bandsRef = db.child('bands')
  const bands = {}
  // NOTE: Might not be nessecary, added to get scenes and events
  const scenesRef = db.child('scenes')
  const eventsRef = db.child('events')
  // const scenes = {}
  const events = {}
  // listening to concert changes in database
  // on(element, snapshot) "picture of database on time of function call TODO: check online for full explanation

  concertsRef.on('value', snap => {
  // concerts and bands now holding the fetched data
  // REVIEW: Restrict users acces for the data, now all Technicians can see all the conserts?
  // NOTE: Fixed so it shows only the correct and approved concerts, but the access is still an issue.
    const concerts = snap.val()
  // Make object concerts into list concert
    Object.keys(concerts).forEach(key => {
      const {staff,isAcceptedByBookingBoss, band} = concerts[key]
      // destructing an object (below is same as the one line above)
      // const staff = concerts[key].staff

      // Filters concerts to show only those that this user is working on.
      if (!staff.includes(this.props.user.uid) || isAcceptedByBookingBoss !== true ) {
        // console.log(isAcceptedByBookingBoss,staff,concerts[key])
        delete concerts[key]
      }
      // If not deleted then we want the band name.
      else {
        bandsRef.child(band).on('value', snap => {
          bands[band] = snap.val()
          // setState here because else it wont update.
          this.setState({bands})
        })
      }
    })

    this.setState({
      //sets this.state.concerts = to the filtered concerts. alt code concerts:concerts
      concerts
    })
  })

// scenesRef.on('value', snap => {
//   const scenes = snap.val()
//   Object.keys(scenes).forEach(key => {
//     const {name} = scenes[key]
//
//     // REVIEW: check this, added to get scenes
//     scenesRef.child(scene).on('value', snap => {
//       scenes[scene] = snap.val()
//
//       this.setState({scenes})
//
//       console.log(scenes.name);
//     })
//     //TODO Set State
//   }
// }

// eventsRef.on('value', snap => {
//   Object.keys(events).forEach(key => {
//     const {location} = events[key]
//     // REVIEW: check this, added to get evnts
//     eventsRef.child(band).on('value', snap => {
//       events[event] = snap.val()
//
//       console.log(evnets.name);
//     })
//     //TODO Set State
//   }
// }

} */

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


  // Object.keys(bands).forEach(key =>{
  //   const name = bands[key].name
  //   const technicalRequirements = bands[key].technicalRequirements
  //   bandsList.push(
  //     <ListItem key={key}>
  //       {name},{technicalRequirements}
  //     </ListItem>
  //
  //   )
  // })


// TODO: get location from db, and add to list
  Object.keys(concerts).forEach(key =>{
    const {from, to, band} = concerts[key]

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
        <p><i className="material-icons">place</i> Location: {}</p>

      </ListItem>
    )

  })

  //mapping happens here
  // console.log(concerts);
  // console.log(bands);

//   Object.keys(concerts).map(function(keyNameCon, keyIndexCon) {
//     return keyNameCon, keyIndexCon, console.log("keyName of concerts: ", keyNameCon,"keyIndex of concerts: ", keyIndexCon)
//   // use keyName to get current key's name
//   // and a[keyName] to get its value
// })
//
//   Object.keys(bands).map(function(keyNameBan, keyIndexBan) {
//     return keyNameBan, keyIndexBan, console.log("keyName of bands: ", keyNameBan,"keyIndex of bands: ", keyIndexBan)
//   // use keyName to get current key's name
//   // and a[keyName] to get its value
// })


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
