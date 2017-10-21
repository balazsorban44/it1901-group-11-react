import React, {Component} from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import {Rating} from '../../utils'
import Send from 'material-ui/svg-icons/content/send'
import firebase from 'firebase'


export default class AddReview extends Component {
  constructor() {
    super()
    this.state = {
      content: "",
      rating: 0,
      isSentReview: false
    }
  }

  handleRatingChange = index => {
    this.setState(({rating}) => ({
      rating: rating===index ? 0 : index
    }))
  }

  handleReviewChange = e => {
    this.setState({content: e.target.value})
  }

  handleSendReviewClick = () => {
    const {content, rating} = this.state
    if (rating !== 0 && content !== "") {
      const db = firebase.database().ref()
      db.child(`bands/${this.props.bandKey}/reviews`)
        .push().set({
          content, rating
        }).then(
          this.setState({
            content: "",
            rating: 0,
            isSentReview: true
          })
        )
    } else {
      alert("Please rate the band and give a review.")
      // COMBAK: Add better error message to validation
    }
  }

  render() {
    const {content, rating, isSentReview} = this.state
    return (
      <div>
        {!isSentReview ?
          <div>
            <div style={{
              display: "flex",
              alignItems: "flex-end"
            }}>
              <TextField
                hintText="This band is amazing!"
                floatingLabelText="Write a review about the band"
                onChange={this.handleReviewChange}
                value={content}
              />
              <RaisedButton
                onClick={this.handleSendReviewClick}
                label="Send"
                labelPosition="before"
                icon={<Send/>}
                style={{marginLeft: "1em"}}
                secondary
              />
            </div>
            <Rating {...{rating}} editable handleRatingChange={this.handleRatingChange}/>
          </div> : <h4>You just sent a review.</h4>
        }
      </div>

    )
  }
}
