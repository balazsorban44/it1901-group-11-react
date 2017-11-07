import React from 'react'
import Band from '../Band'

import {parseDate, parseTime, parseNumber, Icon} from '../../utils'


const Scene = ({name, bands, eventStart}) => (
    <div className="scene">
      <h6>Scene {name}</h6>
      <div className="band-list">
        {bands.map(band => {
          const {name, from, to, size, participants} = band
          const startDay = 1 + new Date(from).getDate() - new Date(eventStart).getDate()
          const endDay = 1 +  new Date(to).getDate() - new Date(eventStart).getDate()
          return (
            <Band
              key={name}
              {...{band}}
              headerType={'compact'}
              title={name}
              showManager
              subtitle={
                <div>
                  <p>Tickets sold/Available seats: {parseNumber(participants)}/{parseNumber(size)}</p>
                  <p>Start date: {`${parseDate(from)}`}</p>
                  <p>Start time/day: {`${parseTime(from)}/${startDay}`}</p>
                  <p>End time/day: {`${parseTime(to)}/${endDay}`}</p>
                </div>
              }
              showReviews
            />
          )
        })}
      </div>
    </div>
)

const ScenesList = ({scenes, eventStart}) => (
  <div>
    <h4><Icon title="Scenes" name="account_balance" color="grey"/></h4>
    <div>
      {Object.keys(scenes).map(key => {
        const scene = scenes[key]
        const {name, bands} = scene
        return <Scene key={name} {...{name, bands, eventStart}}/>
      })}
    </div>
  </div>
)

export default ScenesList
