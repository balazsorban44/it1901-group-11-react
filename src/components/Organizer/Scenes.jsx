import React from 'react'
import Paper from 'material-ui/Paper'
import { Table, TableBody, TableHeader,
  TableHeaderColumn, TableRow,
  TableRowColumn
} from 'material-ui/Table'

import {parseDate, parseTime, Icon} from '../../utils'

const Scene = ({name, bands, eventStart}) => (
    <li className="scene">
      <Paper>
        <h6>Scene {name}</h6>
        <Table className="band-list">
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Band name</TableHeaderColumn>
              <TableHeaderColumn>Start time/day</TableHeaderColumn>
              <TableHeaderColumn>End time/day</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            showRowHover
            displayRowCheckbox={false}
          >
            {bands.map(band => {
              const {name, from, to} = band
              const startDay = 1 + parseInt(parseDate(from).slice(8), 10) - parseInt(parseDate(eventStart).slice(8), 10)
              const endDay = 1 + parseInt(parseDate(to).slice(8), 10) - parseInt(parseDate(eventStart).slice(8), 10)
              return (
                <TableRow key={name} className="band">
                  <TableRowColumn>
                    <p>{name}</p>
                  </TableRowColumn>
                  <TableRowColumn>
                    <p title={parseDate(from)}>{`${parseTime(from)}/${startDay}`}</p>
                  </TableRowColumn>
                  <TableRowColumn>
                    <p title={parseDate(to)}>{`${parseTime(to)}/${endDay}`}</p>
                  </TableRowColumn>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Paper>
    </li>
)

const ScenesList = ({scenes, eventStart}) => (
  <div>
    <h4><Icon title="Scenes" name="account_balance"/></h4>
    <ul className="scenes-list">
      {Object.keys(scenes).map(key => {
        const scene = scenes[key]
        const {name, bands} = scene
        return <Scene key={name} name={name} bands={bands} eventStart={eventStart}/>
      })}
    </ul>
  </div>
)

export default ScenesList
