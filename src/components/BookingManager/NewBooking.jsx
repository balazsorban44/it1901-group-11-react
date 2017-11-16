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


/**
  * NewBooking component
  */
export default class NewBooking extends Component {

  /**
    * NewBooking constructor
    */
  constructor() {
    super()

    /**
      * Set this.state to initialState
      * @type {Object} state
      */
    this.state = {
      open: false,
      canSubmit: false,
      newConcert: {}
    }
  }

  /**
    * Open new booking
    */
  handleOpen = () => this.setState({open: true})

  /**
    * Close new booking
    */
  handleClose = () => this.setState({open: false})

  /**
    * Reset new booking
    */
  resetBooking = () => this.setState({
    open: false,
    canSubmit: false,
    newConcert: {}
  }, () => this.handleClose())


  /**
    * Save new concert to this.state
    * @param {Object} newConcert - New concert to write to the database
    */
  createBooking = newConcert => {
    this.setState({
      newConcert,
      canSubmit: true
    })
  }

  /**
    * Write new concert to the database
    */
  submitBooking = () => {
    firebase.database().ref('concerts')
    .push(this.state.newConcert)
    .then(() => {
      this.resetBooking()
    })
  }

  /**
    * Display New booking
    * @return {JSX} Return New booking
    */
  render() {
    const {open, canSubmit} = this.state
    const {bands, events, scenes, technicians} = this.props
    const bandNames = bands ? Object.keys(bands).map(bandKey => bands[bandKey].name) : []

    /**
      * The submit and cancel buttons for New Booking
      */
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
