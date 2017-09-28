import React, { Component } from 'react'
import firebase from 'firebase'
import Drawer from 'material-ui/Drawer'
import Paper from 'material-ui/Paper'
import MenuItem from 'material-ui/MenuItem'
import {List, ListItem} from 'material-ui/List';

// Reformats date
const parseDate = date => new Date(date).toISOString().slice(0, 10)

// 13.  Som lyd eller lystekniker skal jeg kunne få opp en oversikt over konserter jeg skal jobbe med.
export default class Technician extends Component {
  constructor() {
    super()
    this.state = {
      // initializing local concerts
      concerts:{},
      bands:{},
      // events:{},
      // scenes:{}, REVIEW : Does Technician need all this information???
      openedMenuItem: "concertsOverview"
    }
  }

// Fetching content from firebase
componentDidMount(){
  // referencing database (firebase) "ready up for connect"
  const db = firebase.database().ref()
  // accesing child of database = concerts
  const concertsRef = db.child('concerts')
  const bandsRef = db.child('bands')
  const bands = {}
  // listening to concert changes in database
  // on(element, snapshot) "picture of database on time of function call TODO: check online for full explanation

  concertsRef.on('value', snap => {
  // concerts now holding the fetched data
  // REVIEW: Restrict users acces for the data, now all Technicians can see all the conserts.
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

}

handleMenuItemClick(openedMenuItem){
  this.props.toggleDrawer()
  this.setState({openedMenuItem})
}

  render() {
    const {isDrawerOpened} = this.props
    const {concerts, bands} = this.state

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
  const bandsList = []
  const dateList = []


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

  Object.keys(concerts).forEach(key =>{
    const {from, to, band} = concerts[key]
    let name, technicalRequirements = null
    if (bands[band]) {
      name = bands[band].name
      technicalRequirements = bands[band].technicalRequirements.join(", ")
    }

    dateList.push(
      <ListItem key={key}>
        <p>{name}</p>
        <p>{parseDate(from)} - {parseDate(to)}</p>
        <p>Technical requirements: {technicalRequirements}</p>
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
        {dateList}
      </List>

    </Paper>
  )

}
