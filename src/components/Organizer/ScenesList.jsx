import React from 'react'
import Paper from 'material-ui/Paper'
import Subheader from 'material-ui/Subheader'

const Scene = ({name, bands}) => {
  const bandsList = []

  bands.forEach(band => {
    bandsList.push(<li key={band}><h6>{band}</h6></li>)
  })
  return (
    <li className="scene">
      <Paper>
        <Subheader>Scene {name}</Subheader>
        <ul className="band-list">
          {bandsList}
        </ul>
      </Paper>
    </li>
  )
}

const ScenesList = ({scenes}) => {
  const scenesList = []
  Object.keys(scenes).forEach(key => {
    const scene = scenes[key]
    const {name, bands} = scene
    scenesList.push(<Scene key={name} name={name} bands={bands}/>)
  })
  return (
    <div className="scenes-list">
      <h4>Scenes</h4>
      <ul>
        {scenesList}
      </ul>
    </div>
  )
}

export default ScenesList
