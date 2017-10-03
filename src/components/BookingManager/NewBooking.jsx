import React, {Component} from 'react'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import DatePicker from 'material-ui/DatePicker';

export default class NewBooking extends Component {
  constructor() {
    super()
    this.state = {
      open: false,
      message: ""
    }
  }

  handleOpen = () => {
   this.setState({open: true});
 };

 handleClose = () => {
   this.setState({open: false, message: ""});
 };

 handleChange(e) {
   this.setState({message: e.target.value})
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
        onClick={this.handleClose}
      />,
    ];

    return (
      <div>
        <FloatingActionButton label="+" onClick={this.handleOpen}>
          <ContentAdd/>
        </FloatingActionButton>
        <Dialog
          actions={actions}
          modal
          open={this.state.open}>
          <h1> New Booking</h1>
          <TextField hintText="Band"/><br/>
          <TextField hintText="Price"/><br/>
          <DatePicker hintText="Date" />
          <TextField
            onChange={e => this.handleChange(e)}
            hintText="Message Field"
            floatingLabelText="Message"
            multiLine={true}
            rows={6}
            value={this.state.message}
          />
        </Dialog>
      </div>
    )
  }
}
