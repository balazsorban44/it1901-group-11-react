import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import Avatar from 'material-ui/Avatar'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import firebase from 'firebase'
import {List, ListItem} from 'material-ui/List'
import Paper from 'material-ui/Paper';

export default class Manager extends Component {

  constructor(){
    super()
    this.state = {
      bands: {},
      openedMenuItem: "bandview"
    }
  }
  handleMenuItemClick(openedMenuItem) {
    this.props.toggleDrawer()
    this.setState({openedMenuItem})
  }

  componentDidMount(){
    const db = firebase.database().ref()
    const bandsRef = db.child('bands')
    const concertsRef = db.child('concerts')
    bandsRef.on('value', snap => {
      const bands = snap.val()
      this.setState({bands})
    })
  }

  render() {
    const {user, isDrawerOpened, toggleDrawer, logout} = this.props
    const {uid, img, name} = user
    return (
      <div>
        <Drawer
          open = {isDrawerOpened}>
          <MenuItem onClick={() => this.handleMenuItemClick("bandview")} primaryText="Band view"/>
        </Drawer>
        {{
          "bandview":
          <BandView bands={this.state.bands}/>
        }[this.state.openedMenuItem]}
      </div>
    );
  }
}

const BandView = ({bands}) => (
  <Paper>
  <List>
  {Object.keys(bands).map(bandKey => {
    const {name, genre, concerts, members, technicalRequirements} = bands[bandKey]
    return(<ListItem key={bandKey}><Band band={bands[bandKey]} bandId={bandKey}/ ></ListItem>)
  })}
  </List>
  </Paper>
)

class Band extends Component{
  constructor(){
    super()
    this.state = {
      requirements: [""]
    }
  }

  handleInput(e){
    const {value} = e.target
    this.setState({requirements: value.split(', ')})
  }

  addTechicalRequirement(bandId){
    console.log(this.state.requirements)
  }

  removeTechnicalRequirement(e){
  }
  render(){
    const {name, technicalRequirements, members, genre} = this.props.band
    const bandId = this.props.bandId
    return(
      <div>
        <p>Name: {name}</p>
        <p>Genre: {genre}</p>
        <div>
          <p>Members:</p>
          {Object.keys(members).map(memberKey => {
            return(
              <p key={memberKey}>{members[memberKey]}</p>
            )
          })}
        </div>
        <div>
          <p>Technical requirements:</p>
          {Object.keys(technicalRequirements).map(reqKey => {
            return (
              <p key={reqKey}>{technicalRequirements[reqKey]}</p>
            )
          })}
        </div>
        <form action="#">
          <input value={this.state.requirements.join(', ')} onChange={e => this.handleInput(e)}/>
          <button onClick={() => this.addTechicalRequirement(this.props.bandId)}>Click</button>
        </form>
      </div>
    )
  }
}
