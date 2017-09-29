import React from 'react'
import Avatar from 'material-ui/Avatar'
import {List, ListItem} from 'material-ui/List'
import Paper from 'material-ui/Paper'

const profiles = require.context('../../img/profiles')


const capitalize = s => (s.charAt(0).toUpperCase() + s.slice(1)).replace(/([a-z])([A-Z][a-z])/g, "$1 $2")

const StaffList = ({staff}) => {
  const staffList = []
  Object.keys(staff).forEach(role =>  {
    const staffMembers = staff[role]
    staffMembers.forEach(staffMember => {
      const {name, img, role} = staffMember
      staffList.push(
        <ListItem key={name}
          leftAvatar={<Avatar src={profiles(`./${img}.jpg`)} />}
          primaryText={name}
          secondaryText={capitalize(role)}
        />
      )
    })
  })

  return (
    <div>
      <h4>Staff</h4>
      <Paper>
        <List className="staff-list">
          {staffList}
        </List>
      </Paper>
    </div>
  )
}

export default StaffList
