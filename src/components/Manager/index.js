import React, { Component } from 'react'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import firebase from 'firebase'
import Band from './Band'
import Concert from './Concert'
import {Loading} from '../../utils'

export default class Manager extends Component {

  constructor(){
    super()
    this.state = {
      bands: {},
      openedMenuItem: "bandview",
      concerts: {}
    }
  }
  handleMenuItemClick(openedMenuItem) {
    this.props.toggleDrawer()
    this.setState({openedMenuItem})
  }

  componentDidMount(){
    const db = firebase.database().ref()
    const bandsRef = db.child('bands')
    const staffRef = db.child('staff')
    const concertsRef = db.child('concerts')
    bandsRef.on('value', snap => {
      let bands = snap.val()
      Object.keys(bands).forEach(bandKey => {
        if (bands[bandKey]['manager'] !== this.props.user['uid']){
          delete(bands[bandKey])
        }
        else{
          bands[bandKey].concerts = []
          let memberNames = []
          const members = bands[bandKey].members
          staffRef.child('profiles').on('value', snap => {
            const profiles = snap.val()
            Object.keys(profiles).forEach(profileKey => {
              if (members.includes(profileKey)){
                memberNames.push(profiles[profileKey].name)
              }
            })
            bands[bandKey].members = memberNames
            concertsRef.on('value', snap => {
              const concerts = snap.val()
              Object.keys(concerts).forEach(concertKey => {
                if (concerts[concertKey].band === bandKey){
                  concerts[concertKey].band = bands[bandKey].name
                  let prevState = this.state.concerts
                  prevState[concertKey] = concerts[concertKey]
                  this.setState({concerts: prevState})
                }
                this.setState({bands})
              })
            })
          })
        }
      })
    })
  }

  render() {
    const {isDrawerOpened} = this.props
    return (
      <div className="manager role">
        <Drawer
          open = {isDrawerOpened}>
          <MenuItem onClick={() => this.handleMenuItemClick("bandview")} primaryText="Band view"/>
          <MenuItem onClick={() => this.handleMenuItemClick("concertview")} primaryText="Concert view"/>
        </Drawer>
        {{
          "bandview":
          <BandView bands={this.state.bands}/>,
          "concertview":
          <ConcertView concerts={this.state.concerts} />
        }[this.state.openedMenuItem]}
      </div>
    );
  }
}

const BandView = ({bands}) => (
  <ul className="band-list-manager">
    {Object.keys(bands).length !== 0 ?
      Object.keys(bands).map(bandKey => (
        <Band key={bandKey} band={bands[bandKey]} bandId={bandKey}/>)
      ):
      <Loading/>
      }
  </ul>
)

const ConcertView = ({concerts}) => (
  <ul className="concert-list-manager">
  {Object.keys(concerts).length !== 0 ?
    Object.keys(concerts).map(concertKey => (
      <Concert key={concertKey} concert={concerts[concertKey]} concertId={concertKey}/>)
    ):
    <Loading/>
    }
  </ul>
)
