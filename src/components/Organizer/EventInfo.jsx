import React from 'react'
import Avatar from 'material-ui/Avatar'
import {List, ListItem} from 'material-ui/List'
import Paper from 'material-ui/Paper'
import {capitalize, parseDate, Icon, InfoSnippet} from '../../utils'


/**
  * Get profile picture dynamically
  */
const profiles = require.context('../../img/profiles')

/**
  * Display information about the event
  * @param {Object} props
  * @param {Object} props.event
  * @param {Date} props.event.from - Event's start date
  * @param {Date} props.event.to - Event's end date
  * @param {String} props.event.location - Event's location
  * @param {String} props.event.name - Event's name
  * @return {JSX} Return information about the event
  */
const EventInfo = ({staff, event: {from, to, location, name}}) => {
  return (
    <div>
      <h4><Icon title="Event info" name="info" color="grey"/></h4>
      <Paper  className="event-info">
        <h2>{name}</h2>
        <List>
          <InfoSnippet icon="event" subText="Dates">{`${parseDate(from)} - ${parseDate(to)}`}</InfoSnippet>
          <InfoSnippet icon="map" subText="Location">{location}</InfoSnippet>
          <InfoSnippet icon="people" orientation="portrait" disableTitle disableHover alignSubText="center" subText="Staff members">
            <StaffList {...{staff}}/>
          </InfoSnippet>
        </List>
      </Paper>
    </div>
  )
}

export default EventInfo


/**
  * Display list of staff
  * @param {Object} props
  * @param {Object} props.staff - list of staff
  * @return {JSX} Return list of staff
  */
const StaffList = ({staff}) => {
  let staffList = []
  let techniciansList = []
  Object.keys(staff).forEach(role =>  {
    const staffMembers = staff[role]
    staffMembers.forEach(staffMember => {
      const {name, img, role} = staffMember
      if (role !== "technician") {
        staffList.push (
          <ListItem key={name}
            leftAvatar={<Avatar src={profiles(`./${img}.jpg`)} />}
            primaryText={name}
            secondaryText={capitalize(role)}
          />
        )
      } else {
        techniciansList.push (
          <ListItem
            key={name}
            leftAvatar={<Avatar src={profiles(`./${img}.jpg`)} />}
            primaryText={name}
            secondaryText={capitalize(role)}
          />
        )
      }
    })
  })
  return (
    <div>
      {/* <h5><Icon title="Staff members" name="people"/></h5> */}
      <List className="staff-list">
        {staffList}
      </List>
      <List className="staff-list">
        {techniciansList}
      </List>
    </div>)
}
