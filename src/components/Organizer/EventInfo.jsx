import React from 'react'
import Avatar from 'material-ui/Avatar'
import {List, ListItem} from 'material-ui/List'
import Paper from 'material-ui/Paper'
import {capitalize, parseDate, Icon, InfoSnippet} from '../../utils'

const profiles = require.context('../../img/profiles')

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

const StaffList = ({staff}) => {
  let staffList = []
  Object.keys(staff).forEach(role =>  {
    const staffMembers = staff[role]
    staffMembers.forEach(staffMember => {
      const {name, img, role} = staffMember
      staffList.push (
        <ListItem key={name}
          leftAvatar={<Avatar src={profiles(`./${img}.jpg`)} />}
          primaryText={name}
          secondaryText={capitalize(role)}
        />)
    })
  })
  return (
    <div>
      {/* <h5><Icon title="Staff members" name="people"/></h5> */}
      <List className="staff-list">
        {staffList}
      </List>
    </div>)
}
