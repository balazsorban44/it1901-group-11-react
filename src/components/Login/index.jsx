import React, {Component} from 'react'
import concert from '../../img/concert.jpg'
import firebase from 'firebase'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'

import {Icon} from '../../utils'

export default class Login extends Component {
  login = email => {
    firebase.auth().signInWithEmailAndPassword(email, "123456")
      .catch(error => console.log(error))
  }



  render() {
    return (
      <div id="login">
        <div className="demo-card-wide mdl-card mdl-shadow--2dp">
          <div className="mdl-card__title">
            <h2 className="mdl-card__title-text">Please log in</h2>
          </div>
          <form action="">
            <Menu
            >
              <MenuItem onClick={() => this.login("joe@org.com")} primaryText="joe@org.com" />
              <MenuItem onClick={() => this.login("jane@boob.com")} primaryText="jane@boob.com" />
              <MenuItem onClick={() => this.login("jack@tech.com")} primaryText="jack@tech.com" />
              <MenuItem onClick={() => this.login("frank@pro.com")} primaryText="frank@pro.com" />
              <MenuItem onClick={() => this.login("jessica@boom.com")} primaryText="jessica@boom.com" />
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
