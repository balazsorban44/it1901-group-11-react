import React from 'react'
import Avatar from 'material-ui/Avatar'
import {List, ListItem} from 'material-ui/List'
import Paper from 'material-ui/Paper'
import {capitalize, parseDate, Icon} from '../../utils'

const profiles = require.context('../../img/profiles')

const EventInfo = ({staff, event: {from, to, location, name}}) => {
  return (
    <div>
      <h4><Icon name="info"/></h4>
      <Paper  className="event-info">
        <div className="event-blob">
          <Name {...{name}}/>
          <Dates {...{from, to}}/>
          <Location {...{location}}/>
        </div>
        <StaffList staff={staff}/>
      </Paper>
    </div>
  )
}

export default EventInfo

const Name = ({name}) => <h6>{name}</h6>
const Dates = ({from, to}) => (
  <div>
    <Icon name="event"/>
    <p>{parseDate(from)} - {parseDate(to)}</p>
  </div>)

const Location = ({location}) => (
  <div>
    <Icon name="map"/>
    <p>{location}</p>
  </div>)

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
      <h5><Icon name="people"/></h5>
      <List className="staff-list">
        {staffList}
      </List>
    </div>)
}
