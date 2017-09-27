import React, {Component} from 'react'
import concert from '../../img/concert.jpg'
import firebase from 'firebase'


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
            <h2 className="mdl-card__title-text">Login for more fun!</h2>
          </div>
          <form action="#">
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
              <input
                id="email"
                className="mdl-textfield__input"
                type="email"
                onChange={(e, type) => this.getCredentials(e, "email")}
                value={email}/>
              <label className="mdl-textfield__label" htmlFor="email">E-mail</label>
            </div>
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
              <input
                id="password"
                className="mdl-textfield__input"
                type="password"
                onChange={(e, type) => this.getCredentials(e, "password")}
                value={password}/>
              <label className="mdl-textfield__label" htmlFor="password">Password</label>
            </div>
          </form>

          <div className="mdl-card__actions">
            <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored" onClick={() => this.login()}>
            Login</button>
          </div>
          <div className="mdl-card__menu">
            <i className="material-icons">lock</i>
          </div>
        </div>

        <img className="background-img" src={concert} alt=""/>
      </div>
    )
  }
}
