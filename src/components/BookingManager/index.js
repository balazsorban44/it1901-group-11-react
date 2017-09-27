import React, { Component } from 'react'
import firebase from 'firebase'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';


export default class BookingManager extends Component {
  constructor() {
    super()
    this.state = {
      // initializing local concerts
      openedMenuItem: "MakeOffer"
    }
  }

// Fetching content from firebase
componentDidMount(){
  // referencing database (firebase) "ready up for connect"
  const db = firebase.database().ref()
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
        <TextField hintText="Price"/><br/>
        <div>
        <DatePicker hintText="Date" />

  </div>
        <TextField
          hintText="Message Field"
          floatingLabelText="Message"
          multiLine={true}
          rows={2}
          /><br />
      </div>


const Search = () =>
      <div>
        <h1>Search</h1>
        <TextField hintText="Search"/><br/>
      </div>
const PreviousConcerts = () =>
      <div>
        <h1>Previous concerts</h1>
        <stylesMenu/>
      </div>




  const styles = {
      headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
          ontWeight: 400,
      },
      slide: {
        padding: 10,
      },
    };

const stylesMenu = () =>
  <div>
    <Tabs
      onChange={this.handleChange}
      value={this.state.slideIndex}
    >
      <Tab label="Tab One" value={0} />
      <Tab label="Tab Two" value={1} />
      <Tab label="Tab Three" value={2} />
    </Tabs>
    <SwipeableViews
      index={this.state.slideIndex}
      onChangeIndex={this.handleChange}
    >
      <div>
        <h2 style={styles.headline}>Tabs with slide effect</h2>
        Swipe to see the next slide.<br />
      </div>
      <div style={styles.slide}>
        slide n°2
      </div>
      <div style={styles.slide}>
        slide n°3
      </div>
    </SwipeableViews>
  </div>
