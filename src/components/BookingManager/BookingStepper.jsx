import React, {Component} from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import AutoComplete from 'material-ui/AutoComplete'
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog'
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog'
import DateTimePicker from 'material-ui-datetimepicker'
import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'
import {Step, StepLabel, Stepper, StepContent} from 'material-ui/Stepper'
import {Icon, parsePrice} from '../../utils'

import Moment from 'moment'
import { extendMoment } from 'moment-range'

/**
  * Create a Moment.js instance
  */
const moment = extendMoment(Moment)


/**
  * VerticalLinearStepper component
  */
export default class VerticalLinearStepper extends Component {

  /**
    * VerticalLinearStepper constructor
    */
  constructor() {
    super()

    /**
      * @type {Object} state
      * @property {number} state.stepIndex - Active step's index
      * @property {String} state.bandName - Name of the band
      * @property {Object} state.band - Band
      * @property {number} state.bandFee - Cost of the band
      * @property {Object} state.currentEvent - Current event
      * @property {Object} state.event - Event
      * @property {Object} state.scene - Scene
      * @property {Date} state.from - Event's start date
      * @property {Date} state.to - Event's end date
      * @property {Object} state.technician - Technician for the booking
      * @property {Array} state.stepDisabled - List of steps that are currently disabled
      */
    this.state = {
      stepIndex: 0,
      bandName: "",
      band: null,
      bandFee: null,
      currentEvent: null,
      event: null,
      scene: null,
      from: Date.now(),
      to: null,
      technician: null,
      stepDisabled: Array(6).fill(true)
    }
  }

  /**
    * Handle stepping
    * @param {number} stepIndex - Index of the step

    */
  handleStepChange = (stepIndex) => {
    let {stepDisabled} = this.state
    stepDisabled[stepIndex] = false
    this.setState({stepDisabled})
  }

  /**
    * Handle band change
    * @param {Object} element - Element that was clicked
    * @param {number} index - Index of the band

    */
  handleBandChange = (element, index) => {
    const {bands, bandNames} = this.props
    Object.keys(bands).forEach(bandKey => {
      if (bandNames[index] === bands[bandKey].name) {
        this.setState({band: bandKey})
      }
    })
    this.handleStepChange(0)
  }

  /**
    * Handle band search input field change
    * @param {String} index - Searched value

    */
  handleBandSearchText = bandName => this.setState({bandName})

  /**
    * Handle band fee change
    * @param {Object} e - Element that was clicked

    */
  handleBandFeeChange = e => {
    const bandFee = Number(e.target.value)
    this.setState({bandFee})
    this.handleStepChange(1)
  }


  /**
    * Select an event from the dropdown
    * @param {Object} event - Element that was clicked
    * @param {number} index - Index of the clicked event
    * @param {String} value - ID of the clicked event

    */
  handleEventChange = (event, index, value) => {
    this.setState({
      currentEvent: this.props.events[value],
      event: value
    })
    this.handleStepChange(2)
  }

  /**
    * Select a scene from the dropdown
    * @param {Object} event - Element that was clicked
    * @param {number} index - Index of the clicked scene
    * @param {String} value - ID of the clicked scene

    */
  handleSceneChange = (event, index, value) => {
    this.setState({scene: value})
    this.handleStepChange(3)
  }

  /**
    * Sets the date input as a UNIX timestamp to this.state.from.
    * @param {Date} date - Start date

    */
  handleStartDateChange = date => {
    this.setState({from: date.getTime()})
    this.handleStepChange(4)
  }

  /**
    * Limits the acceptable dates in date picker
    * @param {Date} date - Date
    * @return {Boolean} Whether a date can be chosen or not
    */
  limitAcceptedDates = date => {
    let {from, to} = this.state.currentEvent
    const day = moment(date)
    // Substract one day from 'from' to include the first day of the concert
    const eventRange = moment.range(from-(60*60*1000*24), to)
    return !day.within(eventRange)
  }

  /**
    * Validate and handle concert length change
    * @param {Object} e - Element that was clicked

    */
  handleConcertLengthChange = e => {
    const hours = Number(e.target.value)*60*60*1000
    const {from} = this.state
    const to = from + hours
    if (from < to) {
      this.setState({to})
      this.handleStepChange(5)
    }
  }

  /**
    * Select a technician from the dropdown
    * @param {Object} event - Element that was clicked
    * @param {number} index - Index of the clicked technician
    * @param {String} value - ID of the clicked technician

    */
  handleTechnicianChange = (event, index, value) => {
    this.setState({technician: value})
    this.handleStepChange(6)
  }

  /**
    * Go to the next step
    */
  handleNext = () => {
    const {stepIndex,
      band, bandFee,
      event, from, to,
      scene, technician
    } = this.state
    this.setState({
      stepIndex: stepIndex + 1
    })
    if (stepIndex === 6) {
      this.props.createBooking({
        band, bandFee,
        event,
        from, to,
        scene,
        technicians: {
          [technician]: {
            isAttending: false
          }
        },
        ticketPrice: 0,
        isAcceptedByBookingBoss : "unhandled",
        isAcceptedByBookingManager : true,
        participants : 0
      })
    }
  }

  /**
    * Go to the previous step
    */
  handlePrev = () => {
    const {stepIndex} = this.state
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1})
    }
  }

  /**
    * Display step actions
    * @return {JSX} Return step actions
    */
  renderStepActions(step) {
    const {stepIndex, stepDisabled} = this.state
    return (
      <div style={{margin: '12px 0'}}>
        {stepIndex < 7 &&
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

  /**
    * Display VerticalLinearStepper
    * @return {JSX} Return VerticalLinearStepper
    */
  render() {
    const {
      stepIndex, stepDisabled,
      bandName, bandFee,
      event, currentEvent,
      scene,
      from,
      technician
    } = this.state
    const {bandNames, events, scenes, technicians} = this.props

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
            <StepLabel icon={<Icon name="event"/>}>Select an event {event && `(${currentEvent.name})`}</StepLabel>
            <StepContent>
              <p>On which event do you want the band to play?</p>
              {!stepDisabled[1] &&
                <SelectField
                  value={event}
                  onChange={this.handleEventChange}
                >
                  <MenuItem key={"Event"} value={null} primaryText="Event"/>
                  {events && Object.keys(events).map(eventKey => (
                    <MenuItem
                      key={eventKey}
                      value={eventKey}
                      primaryText={events[eventKey].name}
                    />))
                  }
                </SelectField>
              }
              {this.renderStepActions(2)}
            </StepContent>
          </Step>
          <Step>
            <StepLabel icon={<Icon name="account_balance"/>}>Select a scene {scene && `(${scenes[scene].name})`}</StepLabel>
            <StepContent>
              <p>On which scene do you want the band to play?</p>
              {!stepDisabled[2] &&
                <SelectField
                  value={scene}
                  onChange={this.handleSceneChange}>
                  <MenuItem key={"Scene"} value={null} primaryText="Scene"/>
                  {currentEvent && currentEvent.scenes.map(key => (
                    <MenuItem
                      key={key}
                      value={key}
                      primaryText={scenes[key].name}
                    />))
                  }
                </SelectField>
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

                  // REVIEW: Waiting for node module to be updated
                  // https://github.com/dmtrKovalenko/material-ui-datetimepicker/issues/17
                  /* autoOk */

                  defaultTime={new Date(events[event].from)}
                  value={from ? new Date(from) : new Date(events[event].from)}
                  minutesStep={30}
                  onChange={this.handleStartDateChange}
                  shouldDisableDate={this.limitAcceptedDates}/>
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
            <StepLabel icon={<Icon name="settings_input_component"/>}>Select a technician</StepLabel>
            <StepContent>
              <p>Please select an audio/light technician who will prepare the scene for the concert.</p>
              {!stepDisabled[5] &&
                <SelectField
                  value={technician}
                  onChange={this.handleTechnicianChange}>
                  <MenuItem key={0} value={null} primaryText="Technician"/>
                  {currentEvent.staff.technicians.map(key => (
                    <MenuItem
                      key={key}
                      value={key}
                      primaryText={technicians[key].name}
                    />))
                  }
                </SelectField>
              }
              {this.renderStepActions(6)}
            </StepContent>
          </Step>
          <Step>
            <StepLabel icon={<Icon name="done_all"/>}>Almost done...</StepLabel>
            <StepContent>
              <p>Please send your booking request to the Booking Boss for approval.</p>
              {this.renderStepActions(7)}
            </StepContent>
          </Step>
        </Stepper>
      </div>
    )
  }
}
