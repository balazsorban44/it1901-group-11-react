import React, {Component} from 'react'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import AutoComplete from 'material-ui/AutoComplete'
import FlatButton from 'material-ui/FlatButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import DateTimePicker from 'material-ui-datetimepicker';
import MenuItem from 'material-ui/MenuItem'
import DropDownMenu from 'material-ui/DropDownMenu'

import firebase from 'firebase'


export default class NewBooking extends Component {
  constructor() {
    super()
    this.state = {
      bands: {},
      bandNames: [],
      events: {},
      scenes: {},
      open: false,
      dialog: {
        event:  "Event",
        eventScenes: null,
        scene: "Scene",
        band: null,
        ticketPrice: null,
        from: null,
        to: null
      }
    }
  }
		
  componentWillReceiveProps({bands, events, scenes}) {
    const bandNames = Object.keys(bands).map(key => bands[key].name)
    this.setState({bands, events, scenes, bandNames})
  }


  handleOpen = () => {this.setState({open: true})}

  handleClose = () => {this.setState({open: false})}

  resetBooking = () => {
    this.handleClose()
    this.setState({dialog: {}})
  }
  submitBooking = () => {
    const db = firebase.database().ref()
    const scenesRef = db.child('scenes')
    const concertsRef = db.child('concerts')
    const {scene, from, to, band, ticketPrice} = this.state.dialog
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
  handleChange(type, {target:{value}}) {
    this.setState(prevState => ({
      dialog: {
        ...prevState.dialog,
        [type]: type === "ticketPrice" ? parseInt(value, 10) : value
      }
    }))
  }

  handleStartDateChange = (date) => {   
    this.setState(prevState => ({
      dialog: {
        ...prevState.dialog,
        from: date.getTime()
      }
    }))
  }


  handleEndDateChange = (e) => {
    const hours = parseInt(e.target.value, 10)
    let {from} = this.state.dialog
    from = new Date(from)
    const to = from.setHours(from.getHours() + hours)
    
    this.setState(prevState => ({
      dialog: {
        ...prevState.dialog,
        to
      }
    }))
  }

  handleBandChange(searchText, index) {
    const {bands} = this.state
    this.setState(prevState => ({
      dialog: {
        ...prevState.dialog,
        band: Object.keys(bands)[index]
      }
    }))
  }

  handleEventChange = (event, index, value) => {
    let {events, scenes} = this.state
    let eventScenes = {}
    Object.keys(scenes).forEach(scene => {
      if (events[value].scenes.includes(scene)) {
        eventScenes[scene] = scenes[scene]
      }
    })
    this.setState(({dialog}) => ({
      dialog: {
        ...dialog,
        event: value,
        eventScenes
      }
    }))
  }
  handleSceneChange = (event, index, value) => {

    this.setState(({dialog}) => ({
      dialog: {
        ...dialog,
        scene: value
      }
    }))
  }

  render() {
    const {open, events, bandNames, dialog} = this.state
    const {event, eventScenes, scene} = dialog

    let canSubmit = Object.keys(dialog).map(key => dialog[key] !== null ? true : false).every((e,i,a) => e===true)
    
    
    
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        disabled={!canSubmit}
        onClick={this.submitBooking}
      />,
    ]
    return (
      <div>
        <FloatingActionButton className="new-booking-fab" onClick={this.handleOpen}>
          <ContentAdd/>
        </FloatingActionButton>
        <Dialog
          actions={actions}
          modal
          open={open}>
          <h3> New Booking</h3>
          <AutoComplete
            filter={AutoComplete.fuzzyFilter}
            dataSource={bandNames}
            floatingLabelText="Band"
            maxSearchResults={7}
            onNewRequest={(chosenRequest, index) => this.handleBandChange(chosenRequest, index)}
          /><br/>
          <DropDownMenu value={event} onChange={this.handleEventChange}>
            <MenuItem key={0} value={"Event"} primaryText="Choose event"/>
            {events && Object.keys(events).map(key => (
              <MenuItem
                key={key}
                value={key}
                primaryText={events[key].name}
              />))
            }
          </DropDownMenu>
          <DropDownMenu value={scene} onChange={this.handleSceneChange}>
            <MenuItem key={0} value={"Scene"} primaryText="Choose scene"/>
            {eventScenes && Object.keys(eventScenes).map(key => (
              <MenuItem
                key={key}
                value={key}
                primaryText={eventScenes[key].name}
              />))
            }
          </DropDownMenu><br/>
					<TextField
            hintText="Ticket price (NOK)"
            onChange={e => this.handleChange("ticketPrice", e)}
            type="number"
          />
          <div>
            <DateTimePicker
              hintText="Start date"
              minutesStep={5}
              onChange={this.handleStartDateChange}
              // TODO: Disable past dates and already booked times.
            />

            <TextField
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