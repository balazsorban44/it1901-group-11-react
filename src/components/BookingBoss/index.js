import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import Avatar from 'material-ui/Avatar'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import {green100, green500, green700} from 'material-ui/styles/colors'


const muiTheme = getMuiTheme({
  palette: {
    primary1Color: green500,
    primary2Color: green700,
    primary3Color: green100,
    accent1Color: green700
  },
})



const profiles = require.context('../../img/profiles');

export default class BookingBoss extends Component {

  render() {
    const {user, isDrawerOpened, toggleDrawer, logout} = this.props
    const {uid, img, name} = user
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Drawer open={isDrawerOpened}>
            <div className="user-info">
              <Avatar src={profiles(`./${img}.jpg`)}/>
              <h2>{name}</h2>
            </div>
            <MenuItem primaryText="Menu 1" />
            <RaisedButton onClick={() => logout()} label="Logout"/>
          </Drawer>
          <AppBar   onLeftIconButtonTouchTap={() => toggleDrawer()}  title="Event Manager"
          />

          <div>
            <h3>
              Booking Boss {uid}
            </h3>
          </div>
        </div>
    </MuiThemeProvider>
    );
  }
}
