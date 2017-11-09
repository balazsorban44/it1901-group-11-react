import React, { Component } from 'react'
import firebase from 'firebase'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton';
import {List} from 'material-ui/List'
import {parseDate, parseTime, InfoSnippet} from '../../utils'

class Concert extends Component {
  constructor() {
    super()
    this.state = {
      isAttending: false
    }
  }

  componentDidMount() {
    firebase.database().ref(`concerts/${this.props.concertKey}/technicians/${this.props.technicianId}/isAttending`).on('value', snap => this.setState({isAttending: snap.val()}))
  }

  handleClick = () => {
    this.setState(({isAttending}) =>
    ({isAttending: !isAttending}),
    () => firebase.database()
      .ref(`concerts/${this.props.concertKey}/technicians/${this.props.technicianId}/isAttending`)
      .set(this.state.isAttending))
  }

  render() {
    const {isAttending} = this.state
    const {concert, concertKey} = this.props
    const {from, to, location, bandName, sceneName} = concert
    const technicalRequirements = concert.technicalRequirements.join(", ")
    return (
      <li key={concertKey} className="concert-list-item">
        <Paper>
          <h2>{bandName}</h2>
          <List>
            <InfoSnippet icon="date_range" subText="Date">{parseDate(from)}</InfoSnippet>
            <InfoSnippet icon="access_time" subText="Start/end">{parseTime(from)} - {parseTime(to)}</InfoSnippet>
            <InfoSnippet icon="settings_input_component" subText="Technical requirements">{technicalRequirements}</InfoSnippet>
            <InfoSnippet icon="account_balance" subText="Scene">{sceneName}</InfoSnippet>
            <InfoSnippet icon="place" subText="Location">{location}</InfoSnippet>
            <div style={{display:"flex", justifyContent: "space-between"}}>
              <RaisedButton disabled={isAttending} onClick={this.handleClick} label="Will attend" primary />
              <RaisedButton disabled={!isAttending} onClick={this.handleClick} label="Will not attend" secondary />
            </div>
          </List>
        </Paper>
      </li>
    )
  }
}

const Concerts = ({concerts, technicianId}) => (
  <div>
    <ul className="concert-list">
      {Object.keys(concerts).map(concertKey => (
        <Concert
          key={concertKey}
          concert={concerts[concertKey]}
          {...{concertKey, technicianId}}
        />
      ))}
    </ul>
  </div>
)

export default Concerts
