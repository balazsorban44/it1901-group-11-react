import React, {Component} from 'react'
import concert from '../../img/concert.jpg'
import firebase from 'firebase'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'

import {Icon} from '../../utils'


/**
  * Login component
  */
export default class Login extends Component {

  /**
  * Log the user in
  * @param {String} email - The user's email address

  */
  login = email => {
    firebase.auth().signInWithEmailAndPassword(email, "123456")
      .catch(error => console.log(error))
  }

  /**
    * Display a login form
    * @return {JSX} Return a login form
    */
  render() {
    return (
      <div id="login">
        <div className="demo-card-wide mdl-card mdl-shadow--2dp">
          <div className="mdl-card__title">
            <h2 className="mdl-card__title-text">Please log in</h2>
          </div>
          <form action="">
            <Menu>
              <MenuItem onClick={() => this.login("joe@org.com")} primaryText="joe@org.com"/>
              <MenuItem onClick={() => this.login("jane@boob.com")} primaryText="jane@boob.com"/>
              <MenuItem onClick={() => this.login("jessica@boom.com")} primaryText="jessica@boom.com"/>
              <MenuItem onClick={() => this.login("james@man.com")} primaryText="james@man.com"/>
              <MenuItem onClick={() => this.login("jack@tech.com")} primaryText="jack@tech.com"/>
              <MenuItem onClick={() => this.login("jamie@ser.com")} primaryText="jamie@ser.com"/>
              <MenuItem onClick={() => this.login("frank@pro.com")} primaryText="frank@pro.com"/>
            </Menu>
          </form>
          <div className="mdl-card__menu">
            <Icon name="lock"/>
          </div>
        </div>
        <img className="background-img" src={concert} alt=""/>
      </div>
    )
  }
}
