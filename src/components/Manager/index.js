import React, { Component } from 'react'
import firebase from 'firebase'
import Band from '../Band'
import {Loading} from '../../utils'
import Masonry from 'react-masonry-css'

export default class Manager extends Component {

  constructor(){
    super()
    this.state = {
      bands: {},
      openedMenuItem: "bandview",
      concerts: {}
    }
  }

  componentDidMount(){
    const db = firebase.database().ref()
    const bandsRef = db.child('bands')
    const staffRef = db.child('staff')
    const concertsRef = db.child('concerts')
    const profilesRef = db.child('staff/profiles')

    concertsRef.on('value', snap => {
      const concerts = snap.val()
      Object.keys(concerts).forEach(key => {
        const concert = concerts[key]
        const {technicians} = concert
        const technician = Object.keys(technicians)[0]
        profilesRef.child(technician).on('value', snap => {
          console.log(snap.val());
          concerts[key].contact = `${snap.val().img}@tech.com`
        })
      })
      this.setState({concerts})
    })
    bandsRef.on('value', snap => {
      let bands = snap.val()
      Object.keys(bands).forEach(bandKey => {
        if (bands[bandKey]['manager'] !== this.props.user['uid']){
          delete(bands[bandKey])
        }
        else{
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
            this.setState({bands})
          })
        }
      })
    })
  }

  render() {
    const {bands, concerts} = this.state
    return (
      <div className="manager role">

        <Masonry
          breakpointCols={{
              default: 3,
              1440: 2,
              1024: 1
          }}
          style={{
              margin: "0 auto",
              paddingLeft: 20,
              display: "flex",
              width: "100vw"
          }}
          columnClassName="band-list-column"
        >
          {Object.keys(bands).length !== 0 ?
            Object.keys(bands).map(bandKey => {
              const {name, genre} = bands[bandKey]
              return (
                <Band
                  headerType={'big'}
                  title={name}
                  subtitle={genre}
                  showAlbumSales showGenre showMonthlyListeners
                  showBandMembers
                  showRequirements canEditRequirements
                  showReviews
                  showFutureConcerts
                  key={bandKey}
                  band={bands[bandKey]}
                  {...{bandKey, concerts}}
                />
              )
            }) :
            <Loading/>
          }
        </Masonry>
      </div>
    )
  }
}
