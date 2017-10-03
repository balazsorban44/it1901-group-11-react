import React, {Component} from 'react'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import AutoComplete from 'material-ui/AutoComplete'
import FlatButton from 'material-ui/FlatButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import DatePicker from 'material-ui/DatePicker'
import TimePicker from 'material-ui/TimePicker';


export default class NewBooking extends Component {
  constructor() {
    super()
    this.state = {
      bands: {},
      bandNames: [],
      events: {},
      open: false,
      dialog: {
        message: "",
        band: "",
        price: 0,
        date: ""
      }
    }
  }

  componentWillReceiveProps({bands}) {
    const bandNames = Object.keys(bands).map(key => bands[key].name)
    this.setState({bands, bandNames})
  }

  handleOpen = () => {this.setState({open: true})}

  handleClose = () => {this.setState({open: false})}

  cancelBooking = () => {
    this.handleClose()
    this.setState({dialog: {}})
  }
  submitBooking = () => {
    console.log("Booking sent.");
  }
  handleChange(type, {target:{value}}) {
    this.setState(prevState => ({
      dialog: {
        ...prevState.dialog,
        [type]: type === "price" ? parseInt(value, 10) : value
      }
    }))
  }

  handleDateChange = (date) => {
    this.setState(prevState => ({
      dialog: {
        ...prevState.dialog,
        date: date.getTime()
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
  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        disabled={true}
        onClick={this.submitBooking}
      />,
    ];
    const {open, bandNames} = this.state
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
          <AutoComplete
            filter={AutoComplete.fuzzyFilter}
            dataSource={bandNames}
            floatingLabelText="Event"
            maxSearchResults={7}
            onNewRequest={(chosenRequest, index) => this.handleBandChange(chosenRequest, index)}
          /><br/>
          <AutoComplete
            filter={AutoComplete.fuzzyFilter}
            dataSource={bandNames}
            floatingLabelText="Scene"
            maxSearchResults={7}
            onNewRequest={(chosenRequest, index) => this.handleBandChange(chosenRequest, index)}
          /><br/>
          <TextField
            hintText="Ticket price (NOK)"
            onChange={e => this.handleChange("price", e)}
            type="number"
          />
          <div>
            <DatePicker
              hintText="Start date"
              minDate={new Date()}
              onChange={(a, date) => this.handleDateChange(date)}
            />
            <TimePicker
              format="24hr"
              hintText="Start time"
            />
            <TextField
              hintText="Concert length (hours)"
              type="number"
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
