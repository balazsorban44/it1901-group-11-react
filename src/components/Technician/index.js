import React, { Component } from 'react'
import firebase from 'firebase'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'


// 13.  Som lyd eller lystekniker skal jeg kunne
// få opp en oversikt over konserter jeg skal jobbe med.
export default class Technician extends Component {
  constructor() {
    super()
    this.state = {
      // initializing local concerts
      concerts:{},
      openedMenuItem: "concertsOverview"
    }
  }

// Fetching content from firebase
componentDidMount(){
  // referencing database (firebase) "ready up for connect"
  const db = firebase.database().ref()
  // accesing child of database = concerts
  const concertsRef = db.child('concerts')
  // listening to concert changes in database
  // on(element, snapshot) "picture of database on time of function call TODO: check online for full explanation

  concertsRef.on('value', snap => {
  // concerts now holding the fetched data
  // REVIEW: Restrict users acces for the data, now all Technicians can see all the conserts
    const concerts = snap.val()
  // Make object concerts into list concert
    Object.keys(concerts).forEach(key => {
      const {staff} = concerts[key]
      // destructing an object (below is same as the one line above)
      // const staff = concerts[key].staff
      if (!staff.includes(this.props.user.uid)) {
        delete concerts[key]
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
    const {concerts} = this.state


    // let printThis concerts.forEach(function(value, i) {
    //     console.log(value)
    //   })

    return (
        <div className="Technicians-container">
          <Drawer open={isDrawerOpened}>
            <MenuItem onClick={() => this.handleMenuItemClick("concertsOverview")} primaryText="Concerts Overview" />
          </Drawer>
          {// NOTE:Example of rendering something to screen
          }

          {// Switch-case to toggle MenuItem
          }

          {{
            "concertsOverview":
            <Option1 concerts={concerts}/>

          }[this.state.openedMenuItem]}

          {// TODO: make the proper information appear on screen
          }



        </div>

    )}


}

const Option1 = ({concerts}) => {
  //mapping happens here
  return(
    <div>
      <ul>{concerts['59bc04b271b3c31a520daeae'] && concerts['59bc04b271b3c31a520daeae'].ticketPrice} Dette skal vekk etterhvert</ul>
    </div>
  )

}
