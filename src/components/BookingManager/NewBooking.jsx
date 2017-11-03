import React, {Component} from 'react'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import firebase from 'firebase'

import BookingStepper from './BookingStepper'


const initialState = {
  open: false,
  canSubmit: false,
  newConcert: {}
}
export default class NewBooking extends Component {
  constructor() {
    super()
    this.state = initialState
  }


  // Update the state whenever new data is fetched from the database
  // into the parent component.

  // Handling if the New Booking component is visible or not.
  handleOpen = () => this.setState({open: true})
  handleClose = () => this.setState({open: false})
  resetBooking = () => this.setState(initialState, () => this.handleClose())


  createBooking = newConcert => {
    this.setState({
      newConcert,
      canSubmit: true
    })
  }

  // When this.state.newConcert includes all the necessary info,
  // submitBooking() will push it to the database.
  submitBooking = () => {
    firebase.database().ref('concerts')
    .push(this.state.newConcert)
    .then(() => {
      this.resetBooking()
    })
  }


  render() {
    const {open, canSubmit} = this.state
    const {bands, events, scenes, technicians} = this.props
    const bandNames = bands ? Object.keys(bands).map(bandKey => bands[bandKey].name) : []

    // The submit and cancel buttons for New Booking
    const actions = [
      <FlatButton
        label="Cancel"
        secondary
        onClick={this.resetBooking}
      />,
      <RaisedButton
        style={{marginLeft: "1em"}}
        label="Send request"
        primary
        disabled={!canSubmit}
        onClick={this.submitBooking}
      />,
    ]

    return (
      <div>
        <FloatingActionButton
          className="new-booking-fab"
          secondary
          onClick={this.handleOpen}>
          <ContentAdd/>
        </FloatingActionButton>
        <Dialog
          className="new-booking"
          autoScrollBodyContent modal
          {...{actions, open}}
        >
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            <h4> New Concert</h4>
            <IconButton
              onClick={this.handleClose}
            >
              <FontIcon
                style={{color: '#000'}} className='material-icons'>close</FontIcon>
            </IconButton>
          </div>

          <BookingStepper
            {...{events, bands, bandNames, scenes, technicians}}
            createBooking={this.createBooking}/>
        </Dialog>
      </div>
    )
  }
}
