import React from 'react'
import ReactDOM from 'react-dom'
import './main.css'
import App from './App'
import * as firebase from 'firebase'

// Initialize Firebase
let config = {
  apiKey: "AIzaSyDFLUADdxmxOyCeZ6aS3Ofv3MDJh3upxmU",
  authDomain: "it1901-project.firebaseapp.com",
  databaseURL: "https://it1901-project.firebaseio.com",
  projectId: "it1901-project",
  storageBucket: "it1901-project.appspot.com",
  messagingSenderId: "544685307175"
}
firebase.initializeApp(config)

ReactDOM.render(<App />, document.getElementById('root'))
