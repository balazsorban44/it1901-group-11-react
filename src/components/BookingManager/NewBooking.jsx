import React, {Component} from 'react'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import AutoComplete from 'material-ui/AutoComplete'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog'
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog'
import DateTimePicker from 'material-ui-datetimepicker'
import MenuItem from 'material-ui/MenuItem'
import DropDownMenu from 'material-ui/DropDownMenu'
import {Step, StepLabel, Stepper, StepContent} from 'material-ui/Stepper'
import firebase from 'firebase'
import {Icon, parsePrice} from '../../utils'


// newConcert Object collects the information required
// to make a new booking request.
const newConcert = {
  eventKey:  "Event",
  event: null,
  eventScenes: null,
  scene: "Scene",
  band: null,
  bandFee: null,
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
      canSubmit: false,
      newConcert
    }
  }


  // Update the state whenever new data is fetched from the database
  // into the parent component.
  componentWillReceiveProps({bands, events, scenes}) {
    if (bands) {
      const bandNames = Object.keys(bands).map(key => bands[key].name)
      this.setState({bands, events, scenes, bandNames})
    }
  }

  // Handling if the New Booking component is visible or not.
  handleOpen = () => this.setState({open: true})
  handleClose = () => this.setState({open: false})
  resetBooking = () => this.setState({newConcert}, () => this.handleClose())

  // When this.state.newConcert includes all the necessary info,
  // submitBooking() will generate a concert Object and will
  // push it into the right places in the database.
  submitBooking = () => {
    const db = firebase.database().ref()
    const scenesRef = db.child('scenes')
    const concertsRef = db.child('concerts')
    const {scene, from, to, band, bandFee} = this.state.newConcert
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
      "ticketPrice": 0,
      "staff" : [""],
      bandFee,
      to
    }

    // REVIEW: Only update concerts when accepted by booking boss. (Move this method to Booking Boss)
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

  handleBandFeeChange = e => {
    const bandFee = parseInt(e.target.value, 10)
    this.setState(({newConcert}) => ({
      newConcert: {
        ...newConcert,
        bandFee
      }
    }))
  }

  // Sets the date input as a UNIX timestamp
  // to this.state.newConcert.from.
  handleStartDateChange = date => {
    const from = date.getTime()
    this.setState(({newConcert}) => ({
      newConcert: {...newConcert, from}
    }))
  }

  handleConcertLengthChange = e => {
    const hours = parseInt(e.target.value, 10)*60*60*1000
    const {from} = this.state.newConcert
    const to = from + hours
    if (from < to) {
      this.setState(({newConcert}) => ({
        newConcert: {...newConcert, to}
      }))
    }
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

  canSubmit() {
    this.setState({canSubmit:true})
  }

  // FIXME: limitAcceptedDates disables the first day of the event.
  limitAcceptedDates = date => {
    const {from, to} = this.state.newConcert.event
    return from > date.getTime() || date.getTime() > to || date < Date.now()
  }

  render() {
    const {open, events, bandNames, newConcert, canSubmit} = this.state

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
          contentStyle={{
            maxWidth: 640,
            width:"90%"
          }}
          className="new-booking"
          autoScrollBodyContent
          actions={actions}
          modal
          open={open}>
          <h4> New Concert</h4>

          <VerticalLinearStepper
            {...{bandNames, newConcert, events}}
            handleBandChange={this.handleBandChange}
            handleBandFeeChange={this.handleBandFeeChange}
            handleEventChange={this.handleEventChange}
            handleSceneChange={this.handleSceneChange}
            handleStartDateChange={this.handleStartDateChange}
            handleConcertLengthChange={this.handleConcertLengthChange}
            limitAcceptedDates={this.limitAcceptedDates}
            canSubmit={() => this.canSubmit()}/>
        </Dialog>
      </div>
    )
  }
}


class VerticalLinearStepper extends Component {
  constructor() {
    super()
    this.state = {
      stepIndex: 0,
      bandName: "",
      stepDisabled: Array(6).fill(true)
    }
  }

  handleStepChange = (stepIndex) => {
    let {stepDisabled} = this.state
    stepDisabled[stepIndex] = false
    this.setState({stepDisabled})
  }

  handleBandChange = (element, index) => {
    this.props.handleBandChange(element, index)
    this.setState({bandName: this.props.bandNames[index]})
    this.handleStepChange(0)
  }

  handleBandSearchText = searchText => this.setState({bandName: searchText})

  handleBandFeeChange = e => {
    this.props.handleBandFeeChange(e)
    this.handleStepChange(1)
  }

  handleEventChange = (event, index, value) => {
    this.props.handleEventChange(event, index, value)
    this.handleStepChange(2)
  }

  handleSceneChange = (event, index, value) => {
    this.props.handleSceneChange(event, index, value)
    this.handleStepChange(3)
  }

  handleStartDateChange = date => {
    this.props.handleStartDateChange(date)
    this.handleStepChange(4)
  }
  handleConcertLengthChange = e => {
    this.props.handleConcertLengthChange(e)
    this.handleStepChange(5)
  }

  handleNext = () => {
    const {stepIndex} = this.state
    this.setState({
      stepIndex: stepIndex + 1
    })
    stepIndex === 5 && this.props.canSubmit()
  }

  handlePrev = () => {
    const {stepIndex} = this.state
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1})
    }
  }

  renderStepActions(step) {
    const {stepIndex, stepDisabled} = this.state
    return (
      <div style={{margin: '12px 0'}}>
        {stepIndex < 6 &&
          <RaisedButton
            label={'Next'}
            disableTouchRipple
            disableFocusRipple
            primary
            disabled={stepDisabled[stepIndex]}
            onClick={this.handleNext}
            style={{marginRight: 12}}
          />
        }
        {step > 0 && (
          <FlatButton
            label="Back"
            disabled={stepIndex === 0}
            disableTouchRipple
            disableFocusRipple
            onClick={this.handlePrev}
          />
        )}
      </div>
    )
  }



  render() {
    const {stepIndex, stepDisabled, bandName} = this.state
    const {bandNames, newConcert, events, limitAcceptedDates} = this.props
    const {bandFee, from} = newConcert
    const {eventKey, eventScenes, scene} = newConcert
    return (
      <div>
        <Stepper activeStep={stepIndex} orientation="vertical">
          <Step>
            <StepLabel icon={<Icon name="star"/>}>Select a band {bandName !== "" && `(${bandName})`}</StepLabel>
            <StepContent>
              <p>Which band you want to book a concert for?</p>
              <AutoComplete
                filter={AutoComplete.fuzzyFilter}
                onUpdateInput={this.handleBandSearchText}
                searchText={bandName}
                dataSource={bandNames}
                floatingLabelText="Band"
                maxSearchResults={7}
                onNewRequest={this.handleBandChange}
              />
              {this.renderStepActions(0)}
            </StepContent>
          </Step>
          <Step>
            <StepLabel icon={<Icon name="monetization_on"/>}>Set the band fee {bandFee && `(${parsePrice(bandFee)})`}</StepLabel>
            <StepContent>
              <p>How much money the band will earn on the concert?</p>
              <TextField
                hintText="(NOK)"
                onChange={this.handleBandFeeChange}
                type="number"
                min={1}
                value={bandFee ? bandFee : ""}
              />
              {this.renderStepActions(1)}
            </StepContent>
          </Step>
          <Step>
            <StepLabel icon={<Icon name="event"/>}>Select an event {eventKey !== "Event" && `(${events[eventKey].name})`}</StepLabel>
            <StepContent>
              <p>On which event do you want the band to play?</p>
              { !stepDisabled[1] &&
                <DropDownMenu
                  value={eventKey}
                  onChange={this.handleEventChange}>
                  <MenuItem key={0} value={"Event"} primaryText="Event"/>
                  {events && Object.keys(events).map(key => (
                    <MenuItem
                      key={key}
                      value={key}
                      primaryText={events[key].name}
                    />))
                  }
                </DropDownMenu>
              }
              {this.renderStepActions(2)}
            </StepContent>
          </Step>
          <Step>
            <StepLabel icon={<Icon name="account_balance"/>}>Select a scene {scene !== "Scene" && `(${eventScenes[scene].name})`}</StepLabel>
            <StepContent>
              <p>On which scene do you want the band to play?</p>
              {!stepDisabled[2] &&
                <DropDownMenu
                  value={scene}
                  onChange={this.handleSceneChange}>
                  <MenuItem key={0} value={"Scene"} primaryText="Scene"/>
                  {eventScenes && Object.keys(eventScenes).map(key => (
                    <MenuItem
                      key={key}
                      value={key}
                      primaryText={eventScenes[key].name}
                    />))
                  }
                </DropDownMenu>
              }
              {this.renderStepActions(3)}
            </StepContent>
          </Step>
          <Step>
            <StepLabel icon={<Icon name="date_range"/>}>Set start date</StepLabel>
            <StepContent>
              <p>Please specify when should the band start.</p>
              <label htmlFor="start-date">Start date: </label>
              {!stepDisabled[3] &&
                <DateTimePicker
                  DatePicker={DatePickerDialog}
                  TimePicker={TimePickerDialog}
                  id="start-date"
                  format='YYYY-MM-DD hh:mm'
                  hintText="Start date"
                  autoOk
                  defaultTime={new Date(events[eventKey].from)}
                  value={from ? new Date(from) : new Date(events[eventKey].from)}
                  minutesStep={30}
                  onChange={this.handleStartDateChange}
                  shouldDisableDate={limitAcceptedDates}/>
              }
              {this.renderStepActions(4)}
            </StepContent>
          </Step>
          <Step>
            <StepLabel icon={<Icon name="timelapse"/>}>Concert length</StepLabel>
            <StepContent>
              <p>Please specify the length of the concert</p>
              {!stepDisabled[4] &&
                <TextField
                  id="concert-length"
                  hintText="(hours)"
                  type="number"
                  min={1}
                  onChange={this.handleConcertLengthChange}
                />
              }
              {this.renderStepActions(5)}
            </StepContent>
          </Step>
          <Step>
            <StepLabel icon={<Icon name="done_all"/>}>Almost done...</StepLabel>
            <StepContent>
              <p>Please send your booking request to the Booking Boss for approval.</p>
              {this.renderStepActions(6)}
            </StepContent>
          </Step>
        </Stepper>
      </div>
    )
  }
}
