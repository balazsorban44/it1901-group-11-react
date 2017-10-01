import Chip from 'material-ui/Chip'
import React, { Component } from 'react'
import firebase from 'firebase'

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
    console.log(technicalRequirements)
    technicalRequirements === ['']?
    db.child(`bands/${bandId}/technicalRequirements`).set(this.state.requirements):
    db.child(`bands/${bandId}/technicalRequirements`).set(technicalRequirements.concat(this.state.requirements))
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
      <div>
        <p>Name: {name}</p>
        <p>Genre: {genre}</p>
        <div>
          <p>Members:</p>
          {Object.keys(members).map(memberKey => {
            return(
              <p key={memberKey}>{members[memberKey]}</p>
            )
          })}
        </div>
        <div>
          <p>Technical requirements:</p>
          {Object.keys(technicalRequirements).map(reqKey => {
            return (
              <div>
              {technicalRequirements[reqKey] !== "" &&
              <Chip
                key={reqKey}
                onRequestDelete={this.state.editMode ? () => this.removeTechnicalRequirement(bandId, reqKey) : null}
                style={this.styles.chip}
              >
              {technicalRequirements[reqKey]}</Chip>
            }
              </div>
            )
          })}
        </div>
        {this.state.editMode &&
          <form action="#">
          <input value={this.state.requirements.join(', ')} onChange={e => this.handleInput(e)}/>
          <button onClick={e => this.addTechicalRequirement(e, bandId)}>Add</button>
          </form>
        }


<button onClick={e => this.toggleEdit(e)}>{this.state.editMode ? "Done" : "Edit"}</button>
      </div>
    )
  }
}

export default Band
