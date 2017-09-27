import React, { Component } from 'react'
import firebase from 'firebase'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'


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
            <MenuItem onClick={() => this.handleMenuItemClick("PreviousConserts")} primaryText="Previous conserts" />
            <MenuItem onClick={() => this.handleMenuItemClick("Search")} primaryText="Search" />
          </Drawer>

          <make_offer name = "hei"/>
          <MakeOffer/>
          {{
            "MakeOffer":
            <MakeOffer/>,
            "PreviousConserts":
            <PreviousConserts/>,
            "Search":
            <Search/>

          }[openedMenuItem]}

        </div>
    )}
}

const MakeOffer = () =>
      <div>
        <h1> Make offer</h1>

        <form action="#">
          <div class="mdl-textfield mdl-js-textfield">
            <input class="mdl-textfield__input" type="text" id="sample1"/>
            <label class="mdl-textfield__label" for="sample1">Text...</label>
          </div>
        </form>
        <form action="#">
          <div class="mdl-textfield mdl-js-textfield">
            <input class="mdl-textfield__input" type="text" id="sample1"/>
            <label class="mdl-textfield__label" for="sample1">Text...</label>
          </div>
        </form>

        <form>
          <h5>Band name</h5>
          <input type="text" name="firstname"/>
          <h5>Price</h5>
          <input type="text" name="lastname"/>
        </form>
      </div>


const Search = () =>
      <h1>Search</h1>

const PreviousConserts = () =>
      <h1>Previous consertsr</h1>
