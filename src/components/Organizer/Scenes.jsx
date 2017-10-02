import React from 'react'
import Paper from 'material-ui/Paper'
import Subheader from 'material-ui/Subheader'
import { Table, TableBody, TableHeader,
  TableHeaderColumn, TableRow,
  TableRowColumn
} from 'material-ui/Table'

import {parseDate, parseTime} from '../../utils'

const Scene = ({name, bands, eventStart}) => (
    <li className="scene">
      <Paper>
        <Subheader>Scene {name}</Subheader>
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
                    <h6>{name}</h6>
                  </TableRowColumn>
                  <TableRowColumn>
                    <h6 title={parseDate(from)}>{`${parseTime(from)}/${startDay}`}</h6>
                  </TableRowColumn>
                  <TableRowColumn>
                    <h6 title={parseDate(to)}>{`${parseTime(to)}/${endDay}`}</h6>
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
    <h4>Scenes</h4>
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
