import React, {Component} from 'react'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import AutoComplete from 'material-ui/AutoComplete'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import DateTimePicker from 'material-ui-datetimepicker'
import MenuItem from 'material-ui/MenuItem'
import DropDownMenu from 'material-ui/DropDownMenu'
import {Step, StepLabel, Stepper, StepContent} from 'material-ui/Stepper'

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
      canSubmit: false,
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

  handleEndDateChange = date => {
    this.setState(prevState => ({
      newConcert: {
        ...prevState.newConcert,
        to: date.getTime()
      }
    }))
  }


  // // handleEndDateChange() takes int as an input, which is the length
  // // of a concert. It is added to the from date of the concert, and
  // // then sets it to this.state.newConcert.to as a UNIX timestamp.
  // handleEndDateChange = e => {
  //   const hours = parseInt(e.target.value, 10)
  //   let {from} = this.state.newConcert
  //   from = new Date(from)
  //   const to = from.setHours(from.getHours() + hours)
  //   this.setState(({newConcert}) => ({
  //     newConcert: {
  //       ...newConcert,
  //       to
  //     }
  //   }))
  // }


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
            handleTicketPriceChange={this.handleTicketPriceChange}
            handleEventChange={this.handleEventChange}
            handleSceneChange={this.handleSceneChange}
            handleStartDateChange={this.handleStartDateChange}
            handleEndDateChange={this.handleEndDateChange}
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
    }
  }

  handleNext = () => {
    const {stepIndex} = this.state
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 5,
    })
    stepIndex === 4 && this.props.canSubmit()
  }

  handlePrev = () => {
    const {stepIndex} = this.state
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1})
    }
  }

  renderStepActions(step) {
    const {stepIndex} = this.state
    return (
      <div style={{margin: '12px 0'}}>
        {stepIndex < 5 &&
          <RaisedButton
            label={'Next'}
            disableTouchRipple
            disableFocusRipple
            primary
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
    const {stepIndex} = this.state
    const {
      bandNames, newConcert, events,
      handleBandChange, handleTicketPriceChange,
      handleEventChange, handleSceneChange,
      handleStartDateChange, handleEndDateChange, limitAcceptedDates
    } = this.props
    const {eventKey, eventScenes, scene} = newConcert
    return (
      <div>
        <Stepper activeStep={stepIndex} orientation="vertical">
          <Step>
            <StepLabel icon={<i className="material-icons">star</i>}>Select a band</StepLabel>
            <StepContent>
              <p>Which band you want to book a concert for?</p>
              <AutoComplete
                filter={AutoComplete.fuzzyFilter}
                dataSource={bandNames}
                floatingLabelText="Band"
                maxSearchResults={7}
                onNewRequest={handleBandChange}
              />
              {this.renderStepActions(0)}
            </StepContent>
          </Step>
          <Step>
            <StepLabel icon={<i className="material-icons">monetization_on</i>}>Set ticket price</StepLabel>
            <StepContent>
              <p>What should be the price of a ticket?</p>
              <TextField
                hintText="(NOK)"
                onChange={handleTicketPriceChange}
                type="number"
              />
              {this.renderStepActions(1)}
            </StepContent>
          </Step>
          <Step>
            <StepLabel icon={<i className="material-icons">event</i>}>Select an event</StepLabel>
            <StepContent>
              <p>On which event do you want the band to play?</p>
              <DropDownMenu
                animated={false}
                value={eventKey}
                onChange={handleEventChange}>
                <MenuItem key={0} value={"Event"} primaryText="Event"/>
                {events && Object.keys(events).map(key => (
                  <MenuItem
                    key={key}
                    value={key}
                    primaryText={events[key].name}
                  />))
                }
              </DropDownMenu>
              {this.renderStepActions(2)}
            </StepContent>
          </Step>
          <Step>
            <StepLabel icon={<i className="material-icons">account_balance</i>}>Select a scene</StepLabel>
            <StepContent>
              <p>On which scene do you want the band to play?</p>
              <DropDownMenu
                animated={false}
                value={scene}
                onChange={handleSceneChange}>
                <MenuItem key={0} value={"Scene"} primaryText="Scene"/>
                {eventScenes && Object.keys(eventScenes).map(key => (
                  <MenuItem
                    key={key}
                    value={key}
                    primaryText={eventScenes[key].name}
                  />))
                }
              </DropDownMenu>
              {this.renderStepActions(3)}
            </StepContent>
          </Step>
          <Step>
            <StepLabel icon={<i className="material-icons">date_range</i>}>Set concert dates</StepLabel>
            <StepContent>
              <p>Please specify when should the band play.</p>
              <label htmlFor="start-date">Start date: </label>
              <DateTimePicker
                id="start-date"
                format='YYYY-MM-DD hh:mm'
                hintText="Start date"
                minutesStep={5}
                clearIcon={null}
                onChange={handleStartDateChange}
                shouldDisableDate={limitAcceptedDates}
              />
              <label htmlFor="end-date">End date: </label>
              <DateTimePicker
                id="end-date"
                format='YYYY-MM-DD hh:mm'
                hintText="End date"
                minutesStep={5}
                clearIcon={null}
                onChange={handleEndDateChange}
                shouldDisableDate={limitAcceptedDates}
              />
              {/* <TextField

                hintText="Concert length (hours)"
                type="number"
                min={0}
                onChange={handleEndDateChange}
              /> */}
              {this.renderStepActions(4)}
            </StepContent>
          </Step>
          <Step>
            <StepLabel icon={<i className="material-icons">done_all</i>}>Almost done...</StepLabel>
            <StepContent>
              <p>Please send your booking request to the Booking Boss for approval.</p>
              {this.renderStepActions(5)}
            </StepContent>
          </Step>
        </Stepper>
      </div>
    )
  }
}
