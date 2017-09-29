import React, { Component } from 'react'
import firebase from 'firebase'
import Drawer from 'material-ui/Drawer'
import Badge from 'material-ui/Badge'
import MenuItem from 'material-ui/MenuItem'
import BookingTabSwipe from './BookingTabSwipe'
import {parseDate} from '../../utils'


export default class BookingBoss extends Component {
  constructor() {
    super()
    this.state = {
      concerts: {},
      bands: {}
    }
  }

  handleBooking(concert, isAccepted) {
    const db = firebase.database().ref()
    db.child(`concerts/${concert}/isAcceptedByBookingBoss`).set(isAccepted)
  }
  componentDidMount() {
    const db = firebase.database().ref()
    const concertsRef = db.child('concerts')
    const bandsRef = db.child('bands')
    concertsRef.on('value', snap => {
      this.setState({
        concerts: snap.val()
      })
    })
    bandsRef.on('value', snap => {
      this.setState({
        bands: snap.val()
      })
    })
  }

  render() {
    const {isDrawerOpened, toggleDrawer} = this.props
    const {bands, concerts} = this.state
    const unhandledBookings = []
    let unhandledCounter = 0
    const acceptedBookings = []
    let acceptedCounter = 0
    const rejectedBookings = []
    let rejectedCounter = 0
    Object.keys(concerts).forEach(key => {
      const concert = concerts[key]
      const {band, ticketPrice, from, isAcceptedByBookingManager, isAcceptedByBookingBoss} = concert
      const bandName = bands[band] && bands[band].name
      if (isAcceptedByBookingManager) {
        if (isAcceptedByBookingBoss==="unhandled") {
          unhandledBookings.push(
            <li key={band}>
              <div className="mdl-card mdl-shadow--2dp">
                <div className="mdl-card__title mdl-card--expand">
                  <span className="booking-bg"/>
                  <h4 className="booking-text">
                    {bandName}<br/>
                    {parseDate(from)}<br/>
                    {ticketPrice} NOK<br/>
                  </h4>
                </div>
                <div className="booking-footer mdl-card__actions mdl-card--border">
                  <a onClick={(id, isAccepted) => this.handleBooking(key, true)} className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">Accept</a>
                  <a onClick={(id, isAccepted) => this.handleBooking(key, false)} className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">Reject</a>                <div className="mdl-layout-spacer"></div>
                  <i className="material-icons">event</i>
                </div>
              </div>
            </li>)
              unhandledCounter+=1
              } else if (isAcceptedByBookingBoss) {
                acceptedBookings.push(
                  <li key={band}>
                    <div className="mdl-card mdl-shadow--2dp">
                      <span className="booking-bg"/>
                      <div className="mdl-card__title mdl-card--expand">
                        <h4 className="booking-text">
                          {bandName}<br/>
                        </h4>
                        <h5>
                          {parseDate(from)}<br/>
                          {ticketPrice} NOK<br/>
                        </h5>
                      </div>
                      <div className="booking-footer mdl-card__actions mdl-card--border">
                        Accepted<div className="mdl-layout-spacer"></div>
                        <i className="material-icons green">done</i>
                      </div>
                    </div>
                  </li>)
                acceptedCounter+=1
              } else {
                rejectedBookings.push(
                  <li key={band}>
                    <div className="mdl-card mdl-shadow--2dp">
                      <div className="mdl-card__title mdl-card--expand">
                        <span className="booking-bg"/>
                        <h4 className="booking-text">
                          {bandName}<br/>
                          {parseDate(from)}<br/>
                          {ticketPrice} NOK<br/>
                        </h4>
                      </div>
                      <div className="booking-footer mdl-card__actions mdl-card--border">
                        Rejected<div className="mdl-layout-spacer"></div>
                        <i className="material-icons red">clear</i>
                      </div>
                    </div>
                  </li>)
          rejectedCounter+=1
        }
      }
    })
    return (
        <div>
          <Drawer
            docked={false}
            open={isDrawerOpened}>
            <MenuItem onClick={() => toggleDrawer()} primaryText={
              <div>
                Bookings Overview
                <Badge
                  badgeContent={unhandledCounter}
                  secondary={true}
                  badgeStyle={{top: 18, right: 6}}
                />
              </div>
            }>

            </MenuItem>
          </Drawer>
          <BookingTabSwipe {...{unhandledCounter, unhandledBookings, acceptedCounter, acceptedBookings, rejectedCounter, rejectedBookings}}/>
        </div>
    )
  }
}
