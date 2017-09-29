import React from 'react'
import Paper from 'material-ui/Paper'
import Subheader from 'material-ui/Subheader'

const Scene = ({name, bands}) => (
    <li className="scene">
      <Paper>
        <Subheader>Scene {name}</Subheader>
        <ul className="band-list">
          {bands.map(band =>
            <li key={band} className="band">
              <h6>{band}</h6>
            </li>
          )}
        </ul>
      </Paper>
    </li>
)

const ScenesList = ({scenes}) => (
  <div className="scenes-list">
    <h4>Scenes</h4>
    <ul>
      {Object.keys(scenes).map(key => {
        const scene = scenes[key]
        const {name, bands} = scene
        return <Scene key={name} name={name} bands={bands}/>
      })}
    </ul>
  </div>
)

export default ScenesList
