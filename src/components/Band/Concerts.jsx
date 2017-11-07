import React, {Component} from 'react'

import { Table, TableBody, TableHeader,
  TableHeaderColumn, TableRow,
  TableRowColumn
} from 'material-ui/Table'
import {parseDate, parseNumber, parsePrice, InfoSnippet, muiTheme} from '../../utils'

export default class Concerts extends Component {
  render() {
    const {concerts, showPreviousConcerts, showFutureConcerts} = this.props
    console.log(concerts);
    const acceptedFutureBookings = {}
    const acceptedPreviousBookings = {}
    const awaitingBookings = {}
    if (concerts) {
      Object.keys(concerts).forEach(key => {
        const concert = concerts[key]
        const {isAcceptedByBookingBoss, from} = concert
        if (isAcceptedByBookingBoss === true) {
          if (Date.now() <= from) {
            acceptedFutureBookings[key] = concert
          } else {
            acceptedPreviousBookings[key] = concert
          }
        } else if (isAcceptedByBookingBoss === "unhandled") {
          awaitingBookings[key] = concert
        }
      })
    }

    return (
      <div>
        {showPreviousConcerts && Object.keys(acceptedPreviousBookings).length !== 0 &&
          <InfoSnippet
            icon="history"
            orientation="portrait"
            disableTitle
            disableHover
            alignSubText="center"
            subText="Previous concerts"
          >
            <Table>
              <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                <TableRow>
                  <TableHeaderColumn>Concert date</TableHeaderColumn>
                  <TableHeaderColumn>Tickets sold</TableHeaderColumn>
                  <TableHeaderColumn>Total income</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false} showRowHover>
                {Object.keys(acceptedPreviousBookings).map(key => {
                  const {from, participants, ticketPrice, bandFee} = acceptedPreviousBookings[key]
                  return (
                    <TableRow key={key}>
                        <TableRowColumn>{parseDate(from)}</TableRowColumn>
                        <TableRowColumn>{parseNumber(participants)}</TableRowColumn>
                        <TableRowColumn>{parsePrice(participants*ticketPrice-bandFee)}</TableRowColumn>
                      </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </InfoSnippet>
        }
        {showFutureConcerts && Object.keys(acceptedFutureBookings).length !== 0 &&
          <InfoSnippet
            icon="bookmark"
            orientation="portrait"
            disableTitle
            disableHover
            alignSubText="center"
            subText="Upcoming concerts"
            content={<ConcertTable concerts={acceptedFutureBookings}/>}
          />
        }
        {showFutureConcerts && Object.keys(awaitingBookings).length !== 0 &&
          <InfoSnippet
            icon="bookmark_border"
            orientation="portrait"
            disableTitle
            disableHover
            alignSubText="center"
            subText="Awating approval"
            content={<ConcertTable concerts={awaitingBookings}/>}
          />
        }
      </div>
    )
  }
}


const ConcertTable = ({concerts}) => (
  <Table>
    <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
      <TableRow>
        <TableHeaderColumn>Concert date</TableHeaderColumn>
        <TableHeaderColumn>Ticket price</TableHeaderColumn>
        <TableHeaderColumn>Contact</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody displayRowCheckbox={false} showRowHover>
      {Object.keys(concerts).map(key => {
        const {from, ticketPrice, contact} = concerts[key]
        return (
          <TableRow key={key}>
            <TableRowColumn>{parseDate(from)}</TableRowColumn>
            <TableRowColumn>{ticketPrice === 0 ? "No price yet" : parsePrice(ticketPrice)}</TableRowColumn>
            <TableRowColumn><a style={{color: muiTheme.palette.accent1Color}} href={`mailto:${contact}`}>{contact}</a></TableRowColumn>
          </TableRow>
        )
      })}
    </TableBody>
  </Table>
)
