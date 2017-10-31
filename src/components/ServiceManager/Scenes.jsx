import React from 'react'
import Band from '../Band'

import {parseDate, parseTime, parseNumber, Icon} from '../../utils'


const Scene = ({name, bands, eventStart}) => (
    <div className='scene'>
      <h6>Scene {name}</h6>
      <div className="band-list">
        {bands && bands.map(band => {
          const {name, from, to, participants, genre} = band
          return (
            <Band
              key={name}
              {...{band}}
              headerType={'compact'}
              title={name}
              subtitle={
                <div>
                <p>Tickets sold: {parseNumber(participants)}</p>
                <p>Start date: {`${parseDate(from)}`}</p>
                <p>Start time: {`${parseTime(from)}`}</p>
                <p>End time: {`${parseTime(to)}`}</p>
                <p>Genre: {genre}</p>
              </div>
            }
          />
        )
      })}
      </div>
    </div>
)


const Scenes = ({scenes, eventStart}) => (
  <div>
    <h5><Icon title="Scenes" name="account_balance" color="grey"/></h5>
    <div>
      {Object.keys(scenes).map(key => {
        const scene = scenes[key]
        const {name, bands} = scene
        return <Scene key={name} {...{name, bands, eventStart}}/>
      })}
    </div>
  </div>
)

export default Scenes
