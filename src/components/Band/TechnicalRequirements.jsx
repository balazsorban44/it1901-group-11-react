import React, {Component} from 'react'
import Chip from 'material-ui/Chip'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import firebase from 'firebase'
import {InfoSnippet} from '../../utils'


/**
  * TechnicalRequirements component
  */
export default class TechnicalRequirements extends Component {
  /**
  * TechnicalRequirements constructor
  * @param {Object} props
  */
  constructor(props) {
    super(props)
    const {showRequirements, canEditRequirements} = props

    /**
    * @type {Object} state
    * @property {Boolean} state.showRequirements - Should show technical requirements
    * @property {Boolean} state.canEditRequirements - Can edit the technical requirements
    */
    this.state = {
      requirements: [""],
      editMode: false,
      showRequirements,
      canEditRequirements
    }
  }

  /**
    * Handle changes of the technical requirements input field
    * @param {Object} e - Object containing the requirements

    */
  handleInput = e => this.setState({requirements: e.target.value.split(', ')})

  /**
  * Toggle edit mode

  */
  toggleEdit = () => this.setState(({editMode}) => ({editMode: !editMode}))


  /**
  * Send technical requirements to the database and save it for the given band
  * @param {number} bandId - The ID of the band

  */
  addTechicalRequirement = bandId => {
    const db = firebase.database().ref()
    const bandRef = db.child(`bands/${bandId}/technicalRequirements`)
    const {technicalRequirements} = this.props
    let {requirements} = this.state
    requirements = requirements.filter(requirement => requirement !== '' && requirement.length < 40)
    if (technicalRequirements === ['']) {
      bandRef.set(requirements)
    } else {
      bandRef.set(technicalRequirements.concat(requirements))
    }
    this.setState({requirements: []})
  }

  /**
  * Remove a technical requirement from the database of the given band
  * @param {number} bandId - The ID of the band
  * @param {number} reqId - The ID of the requirement to remove

  */
  removeTechnicalRequirement = (bandId, reqId) => {
    let {technicalRequirements} = this.props
    const db = firebase.database().ref()
    technicalRequirements.length === 1 ? technicalRequirements = [''] : technicalRequirements.splice(reqId, 1)
    db.child(`bands/${bandId}/technicalRequirements`).set(technicalRequirements)
  }


  /**
  * Display a list of technical requirements
  * @param {number} bandId - The ID of the band
  * @param {number} reqId - The ID of the requirement to remove
  * @return {JSX} Return a list of technical requirement list
  */
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
