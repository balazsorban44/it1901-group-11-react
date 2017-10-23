import React, {Component} from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import Send from 'material-ui/svg-icons/content/send'
import firebase from 'firebase'
import {Rating, InfoSnippet, parseDate} from '../../utils'


const Reviews = ({reviews, showReviews}) => {
  let reviewList = []
  let averageRating = []
  Object.keys(reviews).forEach(key => {
    const {content, rating, reviewerName, timestamp} = reviews[key]
    averageRating.push(rating)
    reviewList.push(
      <li
        style={{display: "flex"}}
        key={content}
      >
        <p style={{fontSize: "1.1em"}}>{content} ({rating})</p>
        <span style={{margin: "0 .5em"}}>-</span>
        <p style={{fontStyle: "italic"}}>{reviewerName} ({parseDate(timestamp)})</p>
      </li>
    )
  })
  averageRating = averageRating.reduce((p, c) => p + c) / averageRating.length
  return(
    <div>
      {showReviews &&
        <InfoSnippet
          icon="thumbs_up_down"
          disableTitle
          disableHover
          orientation="portrait"
          alignSubText="center"
          subText="Band reviews"

        >
          {reviews[Object.keys(reviews)[0]].rating !== 0 ?
            <div>
              <ul style={{marginBottom: 0}}>
                {reviewList}
              </ul>
              <div style={{
                display: "flex",
                alignItems: "center"
              }}>
                <h6>({averageRating.toFixed(2)})</h6>
                <Rating rating={Math.ceil(averageRating)}/>
              </div>
            </div> :
          "There is no reviews yet."}
        </InfoSnippet>
      }
    </div>
  )
}

export default Reviews

export class AddReview extends Component {
  constructor() {
    super()
    this.state = {
      content: "",
      rating: 0,
      isSentReview: false
    }
  }

  handleRatingChange = index => this.setState(({rating}) => ({rating: rating===index ? 0 : index}))

  handleReviewChange = e => this.setState({content: e.target.value})

  handleSendReviewClick = () => {
    const {content, rating} = this.state
    if (rating !== 0 && content !== "") {
      const db = firebase.database().ref()
      db.child(`bands/${this.props.bandKey}/reviews`)
        .push().set({
          content, rating,
          timestamp: Date.now(),
          reviewerName: this.props.reviewerName
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
    const {canAddReview, concerts} = this.props
    return (
      <div>
        {canAddReview &&
          <InfoSnippet
            icon="rate_review"
            disableTitle
            disableHover
            orientation="portrait"
            alignSubText="center"
            subText="Review band"
          >
            {concerts[0] !== "" ?
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
              </div> :
              "You cannot review this band because they have not played on any concerts yet."
            }
          </InfoSnippet>
        }
      </div>
    )
  }
}
