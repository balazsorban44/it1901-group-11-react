import React, { Component } from 'react'

import firebase from 'firebase'
import Login from './components/Login'

import Organizer from './components/Organizer'
import BookingBoss from './components/BookingBoss'
import BookingManager from './components/BookingManager'
import Technician from './components/Technician'
import Manager from './components/Organizer'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import {green100, green500, green700} from 'material-ui/styles/colors'
import AppBar from 'material-ui/AppBar'

import RaisedButton from 'material-ui/RaisedButton'
import Avatar from 'material-ui/Avatar'

const profiles = require.context('./img/profiles')

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: green500,
    primary2Color: green700,
    primary3Color: green100,
    accent1Color: green700
  },
})


export default class App extends Component {
  constructor() {
    super()
    this.state = {
      user: null,
      isDrawerOpened: false
    }
  }

  toggleDrawer() {
    this.setState(prevState => (
      {isDrawerOpened: !prevState.isDrawerOpened}
    ))
  }


  logout() {
    firebase.auth().signOut()
      .then(() => {
        this.setState({user: null})
      })
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const db = firebase.database().ref(`staff/profiles/${user.uid}`)
        db.on('value', snap => {
          this.setState({user: Object.assign(snap.val(), {uid: user.uid})})
        })
      }
    })
  }


  render() {
    const {user, isDrawerOpened} = this.state
    return (
      <div className="App">
        <MuiThemeProvider muiTheme={muiTheme}>
          <div>
            {!user ?
              <Login/>:
              <div>
                <AppBar
                  onLeftIconButtonTouchTap={() => this.toggleDrawer()}
                  title="Event Manager"
                >
                  <div className="user-info">
                    <h2>{user.name}</h2>
                    <Avatar src={profiles(`./${user.img}.jpg`)}/>
                    <RaisedButton onClick={() => this.logout()} label="Logout"/>
                  </div>

                </AppBar>

                {{
                  "organizer":
                  <Organizer {...{user, isDrawerOpened}} toggleDrawer={() => this.toggleDrawer()}/>,
                  "bookingBoss":
                  <BookingBoss {...{user, isDrawerOpened}} toggleDrawer={() => this.toggleDrawer()}/>,
                  "bookingManager":
                  <BookingManager {...{user, isDrawerOpened}} toggleDrawer={() => this.toggleDrawer()}/>,
                  "technician":
                  <Technician {...{user, isDrawerOpened}} toggleDrawer={() => this.toggleDrawer()}/>,
                  "manager":
                  <Manager {...{user, isDrawerOpened}} toggleDrawer={() => this.toggleDrawer()}/>
                }[user.role]}
              </div>
            }
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
}
