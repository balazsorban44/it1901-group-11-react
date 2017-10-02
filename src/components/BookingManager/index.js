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
}

//change page to display after item in left menui is clicked
handleMenuItemClick(openedMenuItem){
  this.props.toggleDrawer()
  this.setState({openedMenuItem})
}

  render() {
    const {isDrawerOpened} = this.props
    const {openedMenuItem} = this.state
    const bands = this.state.band
    return (
        <div>
          <Drawer open={isDrawerOpened}>
            <MenuItem onClick={() => this.handleMenuItemClick("newBooking")} primaryText="New booking" />
            <MenuItem onClick={() => this.handleMenuItemClick("search")} primaryText="Search" />
          </Drawer>

          {{
            "newBooking":
            <NewBooking/>,
            "search":
            <Search{...{bands}}/>
          }[openedMenuItem]}

        </div>
    )}
}

const NewBooking = () =>
      <Paper className = "defaultPaper">
        <h1>New booking</h1>
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
