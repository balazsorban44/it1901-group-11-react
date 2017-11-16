import React, { Component } from 'react'

import firebase from 'firebase'
import Login from './components/Login'

import Organizer from './components/Organizer'
import PROrganizer from './components/PROrganizer'
import BookingBoss from './components/BookingBoss'
import BookingManager from './components/BookingManager'
import Technician from './components/Technician'
import Manager from './components/Manager'
import ServiceManager from './components/ServiceManager'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AppBar from 'material-ui/AppBar'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField'

import RaisedButton from 'material-ui/RaisedButton'
import Avatar from 'material-ui/Avatar'

import {profiles, muiTheme} from './utils'


/**
 * This is the main class.
 */
export default class App extends Component {
  constructor() {
    super()
    this.state = {
      user: null,
      loggedin: "joe@org.com",
      isDrawerOpened: false
    }
  }

  toggleDrawer = () => this.setState(({isDrawerOpened}) => ({isDrawerOpened: !isDrawerOpened}))

  /**
  * Log the clicked user in.
  * @param {Object} event - event object of the clicked element
  * @param {number} index - the index of the clicked user
  * @param {String} value - the e-mail of the clicked user
  * @return Nothing
  */
  login = (event, index, value) => {
    this.setState({loggedin: value})
    this.logout()
    firebase.auth().signInWithEmailAndPassword(value, "123456")
  }

  /**
  * Log out the user
  * @return Nothing
  */
  logout() {
    firebase.auth().signOut()
      .then(() => {
        this.setState({user: null})
      })
  }

  /**
  * Set up a listener to authentication changes.
  * @return Nothing
  */
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const {uid} = user
        const db = firebase.database().ref(`staff/profiles/${uid}`)
        db.on('value', snap => {
          this.setState({user: Object.assign(snap.val(), {uid})})
        })
      }
    })
  }


  render() {
    const {user, isDrawerOpened, loggedin} = this.state
    return (

      <div className="App">
        <MuiThemeProvider muiTheme={muiTheme}>
          <div>
            {!user ?
              <Login/>:
              <div>

                <AppBar onLeftIconButtonTouchTap={() => this.toggleDrawer()}>
                  <TextField value={loggedin}/>
                  <SelectField value={loggedin} onChange={this.login}>
                    <MenuItem value="joe@org.com"><Profile name="Joe" img="joe"/></MenuItem>
                    <MenuItem value="jane@boob.com"><Profile name="Jane" img="jane"/></MenuItem>
                    <MenuItem value="jessica@boom.com"><Profile name="Jessica" img="jessica"/></MenuItem>
                    <MenuItem value="james@man.com"><Profile name="James" img="james"/></MenuItem>
                    <MenuItem value="jack@tech.com"><Profile name="Jack" img="jack"/></MenuItem>
                    <MenuItem value="jamie@ser.com"><Profile name="Jamie" img="jamie"/></MenuItem>
                    <MenuItem value="frank@pro.com"><Profile name="Frank" img="frank"/></MenuItem>
                    <MenuItem value=""><RaisedButton secondary label="Logout"/></MenuItem>
                  </SelectField>
                </AppBar>
                {{
                  "organizer":
                  <Organizer {...{user, isDrawerOpened}} toggleDrawer={this.toggleDrawer}/>,
                  "PROrganizer":
                  <PROrganizer {...{user, isDrawerOpened}} toggleDrawer={this.toggleDrawer}/>,
                  "bookingBoss":
                  <BookingBoss {...{user, isDrawerOpened}} toggleDrawer={this.toggleDrawer}/>,
                  "bookingManager":
                  <BookingManager {...{user, isDrawerOpened}} toggleDrawer={this.toggleDrawer}/>,
                  "technician":
                  <Technician {...{user, isDrawerOpened}} toggleDrawer={this.toggleDrawer}/>,
                  "serviceManager":
                  <ServiceManager {...{user, isDrawerOpened}} toggleDrawer={this.toggleDrawer}/>,
                  "manager":
                  <Manager {...{user, isDrawerOpened}} toggleDrawer={this.toggleDrawer}/>
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
          <li><a target="_blank" rel="noopener noreferrer" href="https://reactjs.org/">ReactJS</a></li>
          <li><a target="_blank" rel="noopener noreferrer" href="https://firebase.google.com">Google Firebase</a></li>
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



const Profile = ({name, img}) => (
  <div className="user-info">
    <h2>{name}</h2>
    <Avatar src={profiles(`./${img}.jpg`)}/>
  </div>
)
