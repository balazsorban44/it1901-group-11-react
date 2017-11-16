import React from 'react'
import Band from '../Band'

import {parseDate, parseTime, parseNumber, Icon} from '../../utils'

/**
* Return a scene with information about band and concert start / end
* @param {Object} props
* @param {String} props.name - name
* @param {Object} props.bands - bands containing band and concert information
* @return {JSX} Return a scene with information 
*/

const Scene = ({name, bands}) => (
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

/**
* Display a scene containing concerts
* @param {Object} props
* @param {Object} scenes - scenes containing information
* @param {number} eventStart
* @return {JSX} Return a scene containing concerts with information
*/

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
