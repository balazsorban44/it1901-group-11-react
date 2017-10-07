import React, { Component } from 'react'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import firebase from 'firebase'
import Band from './Band'

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
    bandsRef.on('value', snap => {
      const bands = snap.val()
      Object.keys(bands).forEach(bandKey => {
        if (bands[bandKey]['manager'] !== this.props.user['uid']){
          delete(bands[bandKey])
        }
      })
      this.setState({bands})
    })
  }

  render() {
    const {isDrawerOpened} = this.props
    return (
      <div className="manager role">
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
  <ul className="band-list-manager">
    {Object.keys(bands).map(bandKey => (
      <Band key={bandKey} band={bands[bandKey]} bandId={bandKey}/>)
    )}
  </ul>
)
