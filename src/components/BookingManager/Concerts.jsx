import React, {Component} from 'react'

import { Table, TableBody, TableHeader,
  TableHeaderColumn, TableRow,
  TableRowColumn
} from 'material-ui/Table'
import {parseDate, parseNumber, parsePrice, InfoSnippet} from '../../utils'

export default class Concerts extends Component {
  render() {
    const {concerts} = this.props
    const acceptedBookings = {}
    const awaitingBookings = {}
      Object.keys(concerts).forEach(key => {
        const concert = concerts[key]
        const {isAcceptedByBookingBoss, from} = concert
        if (isAcceptedByBookingBoss === true && Date.now() <= from) {
          acceptedBookings[key] = concert
        } else if (isAcceptedByBookingBoss === "unhandled") {
          awaitingBookings[key] = concert
        }
      })

    return (
      <div>
        <InfoSnippet
          icon="history"
          orientation="portrait"
          disableTitle
          disableHover
          alignSubText="center"
          subText="Previous concerts"
        >
          {Object.keys(concerts)[0] ?
            <Table>
              <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                <TableRow>
                  <TableHeaderColumn>Concert date</TableHeaderColumn>
                  <TableHeaderColumn>Tickets sold</TableHeaderColumn>
                  <TableHeaderColumn>Total income</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false} showRowHover>
                {Object.keys(concerts).map(key => {
                  const {from, participants, ticketPrice, bandFee} = concerts[key]
                  return (
                    from < Date.now() &&
                      <TableRow key={key}>
                        <TableRowColumn>{parseDate(from)}</TableRowColumn>
                        <TableRowColumn>{parseNumber(participants)}</TableRowColumn>
                        <TableRowColumn>{parsePrice(participants*ticketPrice-bandFee)}</TableRowColumn>
                      </TableRow>
                  )
                })}
              </TableBody>
            </Table>: "There is no concerts yet."}
        </InfoSnippet>
        {Object.keys(acceptedBookings).length !== 0 &&
          <InfoSnippet
            icon="bookmark"
            orientation="portrait"
            disableTitle
            disableHover
            alignSubText="center"
            subText="Upcoming concerts"
            content={<ConcertTable concerts={acceptedBookings}/>}
          />
        }
        {Object.keys(awaitingBookings).length !== 0 &&
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
        <TableHeaderColumn>Band fee</TableHeaderColumn>
        <TableHeaderColumn>Ticket price</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody displayRowCheckbox={false} showRowHover>
      {Object.keys(concerts).map(key => {
        const {from, ticketPrice, bandFee,} = concerts[key]
        return (
          <TableRow key={key}>
            <TableRowColumn>{parseDate(from)}</TableRowColumn>
            <TableRowColumn>{parsePrice(bandFee)}</TableRowColumn>
            <TableRowColumn>{ticketPrice === 0 ? "No price yet" : parsePrice(ticketPrice)}</TableRowColumn>
          </TableRow>
        )
      })}
    </TableBody>
  </Table>
)
