import React, {Component} from 'react'
import concert from '../../img/concert.jpg'
import firebase from 'firebase'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

import {Icon} from '../../utils'
const initialState = {
  email: "",
  password: "",
  emailErrorText: "",
  passwordErrorText: "",
  errorText: null
}
export default class Login extends Component {
  constructor() {
    super()
    this.state = initialState
  }
  login = () => {
    const {email, password} = this.state
    firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
      this.setState(initialState)
    }).catch(error => {
      console.log(error);
      const {code, message} = error
      if (code.includes("email")) {
        this.setState({
          emailErrorText: message,
          passwordErrorText: "",
          errorText: null
        })
      } else if (code.includes("password")) {
        this.setState({
          emailErrorText: "",
          passwordErrorText: message,
          errorText: null
        })
      } else {
        this.setState({
          emailErrorText: "",
          passwordErrorText: "",
          errorText: message
        })
      }
    })
  }

  handleEnter = e => {
    if (e.key === "Enter") {
      this.login()
    }
  }

  getCredentials(e, type) {
    const value = e.target.value
    if (type === "email") {
      this.setState({email: value})
    } else {
      this.setState({password: value})
    }
  }


  render() {
    const {email, password, emailErrorText, passwordErrorText, errorText} = this.state
    return (
      <div id="login">
        <div className="demo-card-wide mdl-card mdl-shadow--2dp">
          <div className="mdl-card__title">
            <h2 className="mdl-card__title-text">Please log in</h2>
          </div>
          <form action="#">
            <TextField
              floatingLabelText={"Email"}
              type="email"
              onChange={e => this.getCredentials(e, "email")}
              onKeyUp={this.handleEnter}
              errorText={emailErrorText}
              value={email}/>
            <TextField
              floatingLabelText={"Password"}
              type="password"
              onChange={e => this.getCredentials(e, "password")}
              onKeyUp={this.handleEnter}
              errorText={passwordErrorText}
              value={password}/>
          </form>
          {errorText !== "" &&
            <div>
              <p className="error-text">{errorText}</p>
            </div>
          }
          <div className="mdl-card__actions">
            <RaisedButton className="login-btn" label="Login" secondary onClick={this.login}/>
          </div>
          <div className="mdl-card__menu">
            <Icon name="lock"/>
          </div>
        </div>

        <img className="background-img" src={concert} alt=""/>
      </div>
    )
  }
}
