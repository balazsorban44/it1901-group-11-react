import React from 'react'

const StaffMember = ({name}) => <li key={Math.random()}>{name}</li>

const StaffMembers = ({names, role}) => (
  <li key={role}>
    <p>{role}:</p>
    <ul>
      {names.map(name => <StaffMember key={name} name={name}/>)}
    </ul>
  </li>
)

const StaffList = ({staff}) => (
  <div className="staff-list">
    <h4>Staff</h4>
    <ul>
      {Object.keys(staff).map(role =>  (
        <StaffMembers
          key={role}
          names={staff[role]}
          role={role}/>
      ))}
    </ul>
  </div>
)

export default StaffList
