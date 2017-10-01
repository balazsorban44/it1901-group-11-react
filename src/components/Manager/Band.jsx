import Chip from 'material-ui/Chip'
import React, { Component } from 'react'
import firebase from 'firebase'

import {List, ListItem} from 'material-ui/List'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'

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
    return(
      <Paper className="band">
        <h4>{name} ({genre})</h4>
        <div>
          <List className="member-list">
            {Object.keys(members).map(memberKey => (
              <ListItem key={memberKey}>
                {members[memberKey]}
              </ListItem>
            ))}
          </List>
        </div>
        <div className="technical-requirements">


          <ul>
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
            <li>
              <RaisedButton
                label={this.state.editMode ? "Done" : "Edit"}
                onClick={e => this.toggleEdit(e)}
                labelPosition="before"
                primary
              />
            </li>
          </ul>
          {this.state.editMode &&
            <form>
              <TextField
                hintText="Guitars, Microphone, etc."
                floatingLabelText="Add technical requirement"
                value={this.state.requirements.join(', ')}
                onChange={e => this.handleInput(e)}
              />
              <RaisedButton label="Add" primary onClick={e => this.addTechicalRequirement(e, bandId)}/>
            </form>
          }
        </div>


      </Paper>
    )
  }
}

export default Band
