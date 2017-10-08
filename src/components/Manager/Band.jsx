import Chip from 'material-ui/Chip'
import React, { Component } from 'react'
import firebase from 'firebase'

import Paper from 'material-ui/Paper'
import Divider from 'material-ui/Divider'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

import {InfoSnippet} from '../../utils'

class Band extends Component{
  constructor(){
    super()
    this.state = {
      requirements: [""],
      editMode: false
    }
    this.styles = {
      chip: {
        margin: 'auto'
      }
    }
  }

  handleInput(e){
    const {value} = e.target
    this.setState({requirements: value.split(', ')})
  }
  toggleEdit(e){
      e.preventDefault()
      this.setState(prevState => ({editMode: !prevState.editMode}))
    }

  addTechicalRequirement(e, bandId){
    e.preventDefault()
    const db = firebase.database().ref()
    const {technicalRequirements} = this.props.band
    let {requirements} = this.state
    requirements = requirements.filter(requirement => requirement !== '')
    technicalRequirements === [''] ?
    db.child(`bands/${bandId}/technicalRequirements`).set(requirements):
    db.child(`bands/${bandId}/technicalRequirements`).set(technicalRequirements.concat(requirements))
    this.setState({
      requirements: []
    })
  }

  removeTechnicalRequirement(bandId, reqId){
    let {technicalRequirements} = this.props.band
    const db = firebase.database().ref()
    technicalRequirements.length === 1 ? technicalRequirements = [''] : technicalRequirements.splice(reqId, 1)
    db.child(`bands/${bandId}/technicalRequirements`).set(technicalRequirements)
  }
  render(){
    const {name, technicalRequirements, members, genre} = this.props.band
    const bandId = this.props.bandId
    let bandMembers = []
    Object.keys(members).forEach(memberKey => {
      bandMembers.push(members[memberKey])
    })

    return(
      <li>

        <Paper className="band">
          <h2>{name}</h2>
          <Divider/>
          <InfoSnippet icon="fingerprint" subText="Genre">{genre}</InfoSnippet>
          <InfoSnippet
            icon="people"
            subText="Band members"
          >
            <p className="member-list">{bandMembers.join(", ")}</p>
          </InfoSnippet>
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
              <FlatButton
                label={this.state.editMode ? "Done" : "Edit"}
                onClick={e => this.toggleEdit(e)}
                labelPosition="before"
                primary
              />
            </div>}
            disableTitle
            disableHover
          >
            <ul className="technical-requirements">
              {Object.keys(technicalRequirements).map(reqKey => {
                return (
                  <li key={reqKey}>
                    {technicalRequirements[reqKey] !== "" &&
                      <Chip
                        key={reqKey}
                        onRequestDelete={this.state.editMode ? () => this.removeTechnicalRequirement(bandId, reqKey) : null}
                        style={this.styles.chip}
                      >
                        {technicalRequirements[reqKey]}</Chip>
                    }
                  </li>
                )
              })}
            </ul>
            {this.state.editMode &&
              <form>
                <TextField
                  hintText="Guitars, Microphone, etc."
                  floatingLabelText="Add technical requirement"
                  value={this.state.requirements.join(', ')}
                  onChange={e => this.handleInput(e)}
                />
                <RaisedButton className="add-technical-requirement" label="Add" primary onClick={e => this.addTechicalRequirement(e, bandId)}/>
              </form>
            }
          </InfoSnippet>
        </Paper>
      </li>
    )
  }
}

export default Band
