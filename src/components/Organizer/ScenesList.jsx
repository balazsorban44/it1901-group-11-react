import React from 'react'

const Scene = ({name, bands}) => {
  const bandsList = []

  bands.forEach(band => {
    bandsList.push(<li key={band}><h6>{band}</h6></li>)
  })
  return (
    <li>
      <h5>Scene {name}</h5>
      <ul>
        {bandsList}
      </ul>
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
