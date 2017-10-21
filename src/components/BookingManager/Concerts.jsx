import React, {Component} from 'react'

import { Table, TableBody, TableHeader,
  TableHeaderColumn, TableRow,
  TableRowColumn
} from 'material-ui/Table'
import {parseDate, parseNumber, parsePrice, InfoSnippet} from '../../utils'

export default class Concerts extends Component {
  render() {
    const {concerts, band} = this.props
    const acceptedBookings = {}
    const awaitingBookings = {}
    if (concerts && band.concerts[0] !== "") {
      console.log(band.concerts);
      band.concerts.forEach(key => {
        console.log(key)
        const concert = concerts[key]
        const {isAcceptedByBookingBoss} = concert
        if (isAcceptedByBookingBoss === true) {
          if (Date.now() <= concert.from) {
            acceptedBookings[key] = concert
          }
        } else if (isAcceptedByBookingBoss === "unhandled") {
          awaitingBookings[key] = concert
        }

      })
    }

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
          <Table>
            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn>Concert date</TableHeaderColumn>
                <TableHeaderColumn>Tickets sold</TableHeaderColumn>
                <TableHeaderColumn>Total income</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} showRowHover>
              {concerts &&
                Object.keys(band.concerts).map(key => {
                  const concert = concerts[band.concerts[key]]
                  if (concert) {
                    const {from, participants, ticketPrice, bandFee} = concert
                    if (from < Date.now()) {
                      return (
                        <TableRow key={key}>
                          <TableRowColumn>{parseDate(from)}</TableRowColumn>
                          <TableRowColumn>{parseNumber(participants)}</TableRowColumn>
                          <TableRowColumn>{parsePrice(participants*ticketPrice-bandFee)}</TableRowColumn>
                        </TableRow>
                      )}
                      else return null
                  } else return null
                })
              }
            </TableBody>
          </Table>
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


const ConcertTable = ({concerts}) => {
  return(
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
        const concert = concerts[key]
        const {from, ticketPrice, bandFee,} = concert
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
)}
