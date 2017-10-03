import React, { Component } from 'react'
import firebase from 'firebase'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import Search from './Search'
import NewBooking from './NewBooking'


export default class BookingManager extends Component {
  constructor() {
    super()
    this.state = {
      bands:{},
      // initializing local concerts
      openedMenuItem: "search"
    }
  }

// Fetching content from firebase
componentDidMount(){
  const db = firebase.database().ref()
  const bandsRef = db.child('bands')

  bandsRef.on('value', snap =>{
    const bands = snap.val()
    this.setState({bands})
  })
}

//change page to display after item in left menui is clicked
handleMenuItemClick(openedMenuItem){
  this.props.toggleDrawer()
  this.setState({openedMenuItem})
}

  render() {
    const {isDrawerOpened} = this.props
    const {openedMenuItem, bands} = this.state
    return (
        <div id="booking-manager">
          <Drawer open={isDrawerOpened}>
            <MenuItem onClick={() => this.handleMenuItemClick("newBooking")} primaryText="New booking" />
            <MenuItem onClick={() => this.handleMenuItemClick("search")} primaryText="Search" />
          </Drawer>
          <NewBooking/>
          {{
            "search":
            <Search {...{bands}}/>
          }[openedMenuItem]}

        </div>
    )}
}
