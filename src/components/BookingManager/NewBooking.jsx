import React, {Component} from 'react'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import AutoComplete from 'material-ui/AutoComplete'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import DateTimePicker from 'material-ui-datetimepicker';
import MenuItem from 'material-ui/MenuItem'
import DropDownMenu from 'material-ui/DropDownMenu'

import firebase from 'firebase'


// newConcert Object collects the information required
// to make a new booking request.
const newConcert = {
  eventKey:  "Event",
  event: null,
  eventScenes: null,
  scene: "Scene",
  band: null,
  ticketPrice: null,
  from: null,
  to: null
}

export default class NewBooking extends Component {
  constructor() {
    super()
    this.state = {
      bands: {},
      bandNames: [],
      events: {},
      scenes: {},
      open: false,
      newConcert
    }
  }


  // Update the state whenever new data is fetched from the database
  // into the parent component.
  componentWillReceiveProps({bands, events, scenes}) {
    const bandNames = Object.keys(bands).map(key => bands[key].name)
    this.setState({bands, events, scenes, bandNames})
  }

  // Handling if the New Booking component is visible or not.
  handleOpen = () => this.setState({open: true})
  handleClose = () => this.setState({open: false})
  resetBooking = () => {
    this.handleClose()
    this.setState({newConcert})
  }

  // When this.state.newConcert includes all the necessary info,
  // submitBooking() will generate a concert Object and will
  // push it into the right places in the database.
  submitBooking = () => {
    const db = firebase.database().ref()
    const scenesRef = db.child('scenes')
    const concertsRef = db.child('concerts')
    const {scene, from, to, band, ticketPrice} = this.state.newConcert
    const newConcertRef = concertsRef.push()
    const newConcertKey = newConcertRef.key
    const newConcert = {
      band,
      from,
      "isAcceptedByBookingBoss" : "unhandled",
      "isAcceptedByBookingManager" : true,
      // REVIEW: What to do with the participants?
      "participants" : 0,
      // REVIEW: Staff for concerts?
      "staff" : [""],
      ticketPrice,
      to
    }
    const sceneRef = scenesRef.child(`${scene}/concerts`)
    sceneRef.once('value').then(snap => {
      let updatedScenes = snap.val()
      updatedScenes.push(newConcertKey)
      sceneRef.set(updatedScenes)
    })
    newConcertRef.set(newConcert).then(() => {
      this.resetBooking()
    })
  }

  handleTicketPriceChange = e => {
    const ticketPrice = parseInt(e.target.value, 10)
    this.setState(({newConcert}) => ({
      newConcert: {
        ...newConcert,
        ticketPrice
      }
    }))
  }

  // Sets the date input as a UNIX timestamp
  // to this.state.newConcert.from.
  handleStartDateChange = date => {
    this.setState(prevState => ({
      newConcert: {
        ...prevState.newConcert,
        from: date.getTime()
      }
    }))
  }


  // handleEndDateChange() takes int as an input, which is the length
  // of a concert. It is added to the from date of the concert, and
  // then sets it to this.state.newConcert.to as a UNIX timestamp.
  handleEndDateChange = e => {
    const hours = parseInt(e.target.value, 10)
    let {from} = this.state.newConcert
    from = new Date(from)
    const to = from.setHours(from.getHours() + hours)
    this.setState(({newConcert}) => ({
      newConcert: {
        ...newConcert,
        to
      }
    }))
  }


  handleBandChange = (searchText, index) => {
    const {bands} = this.state
    this.setState(({newConcert}) => ({
      newConcert: {
        ...newConcert,
        band: Object.keys(bands)[index]
      }
    }))
  }

  // If an event is chosen from the dropdown,
  // handleEventChange() will make an eventScenes
  // Object, to narrow down the possible scenes options.
  handleEventChange = (event, index, value) => {
    let {events, scenes} = this.state
    let eventScenes = {}
    Object.keys(scenes).forEach(scene => {
      if (events[value].scenes.includes(scene)) {
        eventScenes[scene] = scenes[scene]
      }
    })
    this.setState(({newConcert}) => ({
      newConcert: {
        ...newConcert,
        eventKey: value,
        event: events[value],
        eventScenes
      }
    }))
  }

  handleSceneChange = (event, index, value) => {
    this.setState(({newConcert}) => ({
      newConcert: {
        ...newConcert,
        scene: value
      }
    }))
  }

  limitAcceptedDates = date => {
    const {from, to} = this.state.newConcert.event
    return from > date.getTime() || date.getTime() > to || date < Date.now()
  }

  render() {
    const {open, events, bandNames, newConcert} = this.state
    const {eventKey, eventScenes, scene} = newConcert
    // The submit button is disabled by default.
    // If all the required fields are filled correctly,
    // canSubmit becomes true
    const canSubmit = Object.keys(newConcert)
                            .map(key => newConcert[key] !== null ? true : false)
                            .every((e,i,a) => e===true)


    // The submit and cancel buttons for New Booking
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={this.resetBooking}
      />,
      <RaisedButton
        label="Create request"
        primary
        disabled={!canSubmit}
        onClick={this.submitBooking}
      />,
    ]

    return (
      <div>
        <FloatingActionButton
          className="new-booking-fab"
          onClick={this.handleOpen}>
          <ContentAdd/>
        </FloatingActionButton>
        <Dialog
          contentStyle={{
            minHeight: 480,
            maxWidth: 640,
            width:"90%"
          }}
          className="new-booking"
          autoScrollBodyContent
          actions={actions}
          modal
          open={open}>
          <h3> New Concert</h3>
          <div className="new-booking-field">
            <AutoComplete
              fullWidth
              filter={AutoComplete.fuzzyFilter}
              dataSource={bandNames}
              floatingLabelText="Band"
              maxSearchResults={7}
              onNewRequest={this.handleBandChange}
            />
            <TextField
              fullWidth
              hintText="Ticket price (NOK)"
              onChange={this.handleTicketPriceChange}
              type="number"
            />
          </div>
          <div className="new-booking-dropdowns">
            <DropDownMenu value={eventKey} onChange={this.handleEventChange}>
              <MenuItem key={0} value={"Event"} primaryText="Event"/>
              {events && Object.keys(events).map(key => (
                <MenuItem
                  key={key}
                  value={key}
                  primaryText={events[key].name}
                />))
              }
            </DropDownMenu>
            <DropDownMenu value={scene} onChange={this.handleSceneChange}>
              <MenuItem key={0} value={"Scene"} primaryText="Scene"/>
              {eventScenes && Object.keys(eventScenes).map(key => (
                <MenuItem
                  key={key}
                  value={key}
                  primaryText={eventScenes[key].name}
                />))
              }
            </DropDownMenu>
          </div>

          <div className="new-booking-field">
            <label htmlFor="start-date">Start date: </label>
            <DateTimePicker
              id="start-date"
              format='YYYY-MM-DD hh:mm'
              showCurrentDateByDefault
              hintText="Start date"
              minutesStep={5}
              clearIcon={null}
              onChange={this.handleStartDateChange}
              shouldDisableDate={this.limitAcceptedDates}
            />
            <TextField
              fullWidth
              hintText="Concert length (hours)"
              type="number"
              min={0}
              onChange={this.handleEndDateChange}
            />
          </div>
          {
            // REVIEW: Do we need a message field?
            /* <TextField
            onChange={e => this.handleChange("message", e)}
            hintText="Message Field"
            floatingLabelText="Message"
            multiLine={true}
            rows={6}
            value={message}
          /> */}
        </Dialog>
      </div>
    )
  }
}
