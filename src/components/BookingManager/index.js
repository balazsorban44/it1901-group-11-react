import React, { Component } from 'react'
// import firebase from 'firebase'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField';


export default class BookingManager extends Component {
  constructor() {
    super()
    this.state = {
      // initializing local concerts
      openedMenuItem: ""
    }
  }

// Fetching content from firebase
componentDidMount(){
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

    return (
        <div>
          <Drawer open={isDrawerOpened}>
            <MenuItem onClick={() => this.handleMenuItemClick("component")} primaryText="Booking Manager" />
            <MenuItem onClick={() => this.handleMenuItemClick("MakeOffer")} primaryText="Make offer" />
            <MenuItem onClick={() => this.handleMenuItemClick("PreviousConcerts")} primaryText="Previous concerts" />
            <MenuItem onClick={() => this.handleMenuItemClick("Search")} primaryText="Search" />
          </Drawer>

          <make_offer name = "hei"/>

          {{
            "MakeOffer":
            <MakeOffer/>,
            "PreviousConcerts":
            <PreviousConcerts/>,
            "Search":
            <Search/>

          }[openedMenuItem]}

        </div>
    )}
}

const MakeOffer = () =>
      <div>
        <h1> Make offer</h1>
        <TextField hintText="Band"/><br/>
        <TextField hintText="Price"/>
      </div>


const Search = () =>
      <h1>Search</h1>

const PreviousConcerts = () =>
      <h1>Previous concerts</h1>
