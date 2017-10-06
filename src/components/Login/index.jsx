import React, {Component} from 'react'
import concert from '../../img/concert.jpg'
import firebase from 'firebase'
import TextField from 'material-ui/TextField'
import FontIcon from 'material-ui/FontIcon'
import RaisedButton from 'material-ui/RaisedButton'

export default class Login extends Component {
  constructor() {
    super()
    this.state = {
      email: "",
      password: "",
    }
  }
  login() {
    const {email, password} = this.state
    firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
      this.setState({
        email: "",
        password: ""
      })
    }).catch(error => console.log(error))
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
    const {email, password} = this.state
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
              onChange={(e, type) => this.getCredentials(e, "email")}
              value={email}/>
            <TextField
              floatingLabelText={"Password"}
              type="password"
              onChange={(e, type) => this.getCredentials(e, "password")}
              value={password}/>
          </form>

          <div className="mdl-card__actions">
            <RaisedButton className="login-btn" label="Login" secondary onClick={() => this.login()}/>
          </div>
          <div className="mdl-card__menu">
            <FontIcon className="material-icons">lock</FontIcon>
          </div>
        </div>

        <img className="background-img" src={concert} alt=""/>
      </div>
    )
  }
}
