import React, { Component } from 'react'
import firebase from 'firebase'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'


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

          {// Switch-case to toggle MenuItem
          }

          {{
            "concertsOverview":
            <ConcertsOverview {...{concerts, bands}}/>

          }[this.state.openedMenuItem]}

          {// TODO: make the proper information appear on screen
          }
        </div>
    )
  }
}



const ConcertsOverview = ({concerts, bands}) => {
  //mapping happens here
  // console.log(concerts);
  // console.log(bands);

  //Return statement for ConcertsOverview
  return(
    <div>
      <ul>
        {JSON.stringify(bands)}
        {JSON.stringify(concerts)}

      </ul>
    </div>
  )

}
