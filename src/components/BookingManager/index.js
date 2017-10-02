import React, { Component } from 'react'
import firebase from 'firebase'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import Paper from 'material-ui/Paper';
import Search from './Search'


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


  // referencing database (firebase) "ready up for connect"
  // const db = firebase.database().ref()
  // accesing child of database = concerts

}

handleMenuItemClick(openedMenuItem){
  this.props.toggleDrawer()
  this.setState({openedMenuItem})
}

  render() {
    const {isDrawerOpened} = this.props
    const {openedMenuItem} = this.state
    const bands = this.state.band
    return (
        <div id="booking-manager">
          <Drawer open={isDrawerOpened}>
            <MenuItem onClick={() => this.handleMenuItemClick("newBooking")} primaryText="New booking" />
            <MenuItem onClick={() => this.handleMenuItemClick("search")} primaryText="Search" />
          </Drawer>

          {{
            "newBooking":
            <MakeOffer/>,
            "search":
            <Search{...{bands}}/>
          }[openedMenuItem]}

        </div>
    )}
}


const MakeOffer = () =>
      <Paper className = "make-offer">
        <h1> Make offer</h1>
        <TextField hintText="Band"/><br/>
        <TextField hintText="Price"/><br/>
        <DatePicker hintText="Date" />
        <TextField
          hintText="Message Field"
          floatingLabelText="Message"
          multiLine={true}
          rows={6}
        />
      </Paper>
