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
        <button onClick={() => this.login()}>Login</button>
        <img className="background-img" src={concert} alt=""/>
      </div>
    )
  }
}
