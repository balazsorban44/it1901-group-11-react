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
      this.setState({bands})
    })
  }

  render() {
    const {isDrawerOpened} = this.props
    return (
      <div id="manager">
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
  <div>
    <h2>My bands</h2>
    <ul className="band-list-manager">
      {Object.keys(bands).map(bandKey => {
        return(<li key={bandKey}><Band band={bands[bandKey]} bandId={bandKey}/></li>)
      })}
    </ul>
  </div>
)
