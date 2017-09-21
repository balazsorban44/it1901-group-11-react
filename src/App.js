import React, { Component } from 'react'
import concert from './img/concert.jpg'


import darkBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import Avatar from 'material-ui/Avatar'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton'
import firebase from 'firebase'

import Roles from './components/Roles'


import {green100, green500, green700} from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: green500,
    primary2Color: green700,
    primary3Color: green100,
    accent1Color: green700
  },
})


class App extends Component {
  constructor() {
    super()
    this.state = {
      data: {
        events: {},
        profiles: {},
        scenes: {},
        concerts: {},
        bands: {}
      },
      isLoggedIn: false,
      user: null,
      email: "",
      password: "",
      isDrawerOpened: false
    }
  }

  handleDrawerToggle() {
    this.setState(prevState => ({
      isDrawerOpened: !prevState.isDrawerOpened
    }))
  }

  getCredentials(e, type) {
    const value = e.target.value
    if (type === "email") {
      this.setState({email: value})
    } else {
      this.setState({password: value})
    }

  }

  login() {
    const {email, password} = this.state
    firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
      this.setState({
        email: "",
        password: "",
        isLoggedIn: true
      })
    }).catch(error => console.log(error))
  }

  logout() {
    firebase.auth().signOut()
      .then(() => {
        this.setState({
          user: null,
          isLoggedIn: false,
        });
      });
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const db = firebase.database().ref(`staff/profiles/${user.uid}`)
        db.on('value', snap => {
          this.setState({
            user: snap.val(),
            isLoggedIn: true
          })
        })
      }
    })
  }


  render() {
    const {isLoggedIn, email, password, user} = this.state
    return (
      <div className="App">
        <MuiThemeProvider muiTheme={muiTheme}>
          <div>
            <AppBar
              onLeftIconButtonTouchTap={() => this.handleDrawerToggle()}
            title="Event Manager">
            </AppBar>
            <Drawer
              swipeAreaWidth={100}
              open={this.state.isDrawerOpened}>
              {isLoggedIn &&
                <div className="user-info">
                  <Avatar src={`img/${user.img}.jpg`}/>
                  <h2>{user.name}</h2>
                </div>
              }
              <MenuItem>Menu Item</MenuItem>
              <MenuItem>Menu Item 2</MenuItem>
              {isLoggedIn && <RaisedButton onClick={() => this.logout()} label="Logout" secondary={true}/>
              }
            </Drawer>
            {!isLoggedIn ?
              <div>
                <h2>Login</h2>
                <input
                  type="email"
                  placeholder="E-mail"
                  onChange={(e, type) => this.getCredentials(e, "email")}
                  value={email}/>
                <input
                  type="password"
                  placeholder="Password"
                  onChange={(e, type) => this.getCredentials(e, "password")}
                  value={password}/>
                <RaisedButton onClick={() => this.login()} label="Login" secondary={true} />
              </div>:
              <Roles role={user.role}/>
            }
            <img className="background-img" src={concert} alt=""/>
          </div>
        </MuiThemeProvider>
      </div>
  )}
}

export default App
