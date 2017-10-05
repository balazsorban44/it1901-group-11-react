import React, { Component } from 'react'

import firebase from 'firebase'
import Login from './components/Login'

import Organizer from './components/Organizer'
import BookingBoss from './components/BookingBoss'
import BookingManager from './components/BookingManager'
import Technician from './components/Technician'
import Manager from './components/Manager'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import {amber500, amber700} from 'material-ui/styles/colors'
import AppBar from 'material-ui/AppBar'

import RaisedButton from 'material-ui/RaisedButton'
import Avatar from 'material-ui/Avatar'

const profiles = require.context('./img/profiles')

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: "#f8c53b",
    primary2Color: amber500,
    primary3Color: amber700,
    accent1Color: "#ea4a53"
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
                <AppBar onLeftIconButtonTouchTap={() => this.toggleDrawer()}>
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
        <Footer/>
      </div>
    )
  }
}


const Footer = () => (
  <footer className="mdl-mega-footer">
    <div className="mdl-mega-footer__middle-section">

      <div className="mdl-mega-footer__drop-down-section">
        <h1 className="mdl-mega-footer__heading">Documentation<i className="material-icons">insert_drive_file</i></h1>
        <ul className="mdl-mega-footer__link-list">
          <li><a target="_blank" rel="noopener noreferrer" href="https://github.com/balazsorban44/it1901-group-11-react">GitHub</a></li>
          <li><a target="_blank" rel="noopener noreferrer" href="https://trello.com/b/AO4STf0n/it1901-prosjekt">Trello</a></li>
        </ul>
      </div>

      <div className="mdl-mega-footer__drop-down-section">
        <h1 className="mdl-mega-footer__heading">Technology<i className="material-icons">build</i></h1>
        <ul className="mdl-mega-footer__link-list">
          <li><a target="_blank" rel="noopener noreferrer" href="https://reactjs.org/">React</a></li>
        </ul>
      </div>

      <div className="mdl-mega-footer__drop-down-section">
        <h1 className="mdl-mega-footer__heading">External libraries<i className="material-icons">library_books</i></h1>
        <ul className="mdl-mega-footer__link-list">
          <li><a target="_blank" rel="noopener noreferrer" href="http://www.material-ui.com">Material-UI</a></li>
          <li><a target="_blank" rel="noopener noreferrer" href="https://getmdl.io/">Material Design Lite</a></li>
        </ul>
      </div>

      <div className="mdl-mega-footer__drop-down-section">
        <h1 className="mdl-mega-footer__heading">Team<i className="material-icons">people</i></h1>
        <ul className="mdl-mega-footer__link-list">
          <li><a target="_blank" rel="noopener noreferrer" href="https://balazsorban.com">Balázs Orbán</a></li>
          <li><a target="_blank" rel="noopener noreferrer" href="https://github.com/supertosse">Stian Tøsse</a></li>
          <li><a target="_blank" rel="noopener noreferrer" href="https://github.com/matsjp">Mats Pedersen</a></li>
          <li><a target="_blank" rel="noopener noreferrer" href="https://github.com/AleksanderKarlsson">Aleksander Karlsson</a></li>
          <li><a target="_blank" rel="noopener noreferrer" href="https://github.com/Hxnsa">Erik Krüger</a></li>
        </ul>
      </div>

    </div>

    <div className="mdl-mega-footer__bottom-section">
      <div className="mdl-logo"><a target="_blank" rel="noopener noreferrer" href="https://eventmanager.netlify.com">Event Manager</a></div>
      <ul className="mdl-mega-footer__link-list">
        <li>Made with ❤ at <a target="_blank" rel="noopener noreferrer" href="https://ntnu.edu">NTNU</a></li>
        <li>IT1901</li>
        <li>Group 11</li>
      </ul>
    </div>
  </footer>
)
