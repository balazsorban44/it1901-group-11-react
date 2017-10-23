import React, {Component} from 'react'
import Chip from 'material-ui/Chip'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import firebase from 'firebase'
import {InfoSnippet} from '../../utils'

export default class TechnicalRequirements extends Component {
  constructor(props) {
    super(props)
    const {showRequirements, canEditRequirements} = props
    this.state = {
      requirements: [""],
      editMode: false,
      showRequirements,
      canEditRequirements
    }
  }


  handleInput = e => this.setState({requirements: e.target.value.split(', ')})

  toggleEdit = () => this.setState(({editMode}) => ({editMode: !editMode}))

  addTechicalRequirement = bandId => {
    const db = firebase.database().ref()
    const bandRef = db.child(`bands/${bandId}/technicalRequirements`)
    const {technicalRequirements} = this.props
    let {requirements} = this.state
    requirements = requirements.filter(requirement => requirement !== '')
    if (technicalRequirements === ['']) {
      bandRef.set(requirements)
    } else {
      bandRef.set(technicalRequirements.concat(requirements))
    }
    this.setState({requirements: []})
  }

  removeTechnicalRequirement = (bandId, reqId) => {
    let {technicalRequirements} = this.props
    const db = firebase.database().ref()
    technicalRequirements.length === 1 ? technicalRequirements = [''] : technicalRequirements.splice(reqId, 1)
    db.child(`bands/${bandId}/technicalRequirements`).set(technicalRequirements)
  }

  render() {
    const {requirements, editMode, showRequirements, canEditRequirements} = this.state
    const {technicalRequirements, bandKey} = this.props
    return (
      <div>
        {showRequirements &&
          <InfoSnippet
            icon="settings_input_component"
            alignSubText="stretch"
            subText={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexGrow: 1,
                  justifyContent: "space-between"
                }}>
                <p>Technical requirements</p>
                {canEditRequirements &&
                  <FlatButton
                    label={this.state.editMode ? "Done" : "Edit"}
                    onClick={this.toggleEdit}
                    labelPosition="before"
                    primary
                  />
                }
              </div>}
            disableTitle
            disableHover
          >
            <ul style={{
              display: "flex",
              flexWrap: "wrap",
              marginTop: "1em"
            }}>
              {Object.keys(technicalRequirements).map(reqKey => {
                return (
                  <li  style={{margin: "0 .6em .6em 0"}} key={reqKey}>
                    {technicalRequirements[reqKey] !== "" &&
                      <Chip
                        key={reqKey}
                        onRequestDelete={editMode ? () => this.removeTechnicalRequirement(bandKey, reqKey) : null}
                      >
                        {technicalRequirements[reqKey]}</Chip>
                    }
                  </li>
                )
              })}
            </ul>
            {editMode &&
              <form>
                <TextField
                  hintText="Guitars, Microphone, etc."
                  floatingLabelText="Add technical requirement"
                  value={requirements.join(', ')}
                  onChange={e => this.handleInput(e)}
                />
                <RaisedButton style={{marginLeft: "1em"}} label="Add" primary onClick={() => this.addTechicalRequirement(bandKey)}/>
              </form>
            }
          </InfoSnippet>
        }
      </div>
    )
  }
}
