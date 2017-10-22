import React, {Component} from 'react'
import Chip from 'material-ui/Chip'
import {List} from 'material-ui/List'
import FontIcon from 'material-ui/FontIcon'
import {Card, CardText, CardMedia, CardTitle} from 'material-ui/Card'
import AddReview from './AddReview'
import Concerts from './Concerts'
import firebase from 'firebase'
import {InfoSnippet, parseNumber, parseDate, muiTheme, Rating} from '../../utils'
import musician from '../../img/musician.jpg'

//Card for every band in search results
export default class Band extends Component {
  constructor() {
    super()
    this.state = {
      manager: {},
      cover: ""
    }
  }

  componentDidMount() {
    const db = firebase.database().ref()
    const profilesRef = db.child('staff/profiles')
    profilesRef.child(this.props.band.manager).on('value', snap => {
      this.setState({manager: snap.val()})
    })

    // fanarttv.getImagesForArtist(this.props.bandKey).then(data => console.log(data))

    fetch(`https://webservice.fanart.tv/v3/music/${this.props.bandKey}?api_key=152d071f673f4e189fbe2a1e17606481`)
    .then(response => {
      if (response.ok) {
        response.json().then(result => {
        result.artistbackground && this.setState({cover: result.artistbackground[0].url})
      })}
    })


  }

  render() {
    let {bandKey, band, concerts, reviewerName} = this.props
    const {manager: {name: managerName, email}, cover} = this.state

    concerts = Object.keys(concerts)
      .filter(key => band.concerts.includes(key))
      .reduce((obj, key) => {
        obj[key] = concerts[key]
        return obj
      }, {})

    const {name, genre, albumSales, monthlyListeners, technicalRequirements, reviews} = band
    return (
      <Card className="search-result">

        <CardMedia actAsExpander overlay={
          <CardTitle title={name} subtitle="click for more"/>}>
          <img src={cover !== "" ? cover : musician} alt={name}/>
        </CardMedia>

        <CardText expandable>
          <List style={{display: "flex", flexWrap: "wrap"}}>
            <InfoSnippet
              icon="album"
              subText="Album sales"
              content={parseNumber(albumSales)}
            />
            <InfoSnippet
              icon="music_note"
              subText="Monthly listeners"
              content={parseNumber(monthlyListeners)}
            />
            <InfoSnippet
              icon="fingerprint"
              subText="Genre"
              content={genre}
            />
            {email && managerName &&
              <InfoSnippet
                icon="business"
                subText="Band manager"
                disableHover
              >
                <div style={{
                    display: "flex",
                    alignItems: "center"
                }}>
                  <div style={{fontSize: "1.1em", margin: 0}}>{managerName}</div>
                  <FontIcon title={email} color={muiTheme.palette.accent1Color} style={{ marginLeft: ".5em", cursor: "pointer",fontSize: ".9em"}} className="material-icons">mail</FontIcon>
                </div>
              </InfoSnippet>
            }
          </List>
          <InfoSnippet
            icon="settings_input_component"
            subText="Technical requirements"
            content={
              <div style={{display: "flex", flexWrap: "wrap"}}>
                {technicalRequirements.map(technicalRequirement => <Chip style={{margin: "0 .5em .5em 0"}} key={technicalRequirement}>{technicalRequirement}</Chip>)}
              </div>
            }
          />
          <Concerts {...{concerts}}/>
          <InfoSnippet
            icon="rate_review"
            disableTitle
            disableHover
            orientation="portrait"
            alignSubText="center"
            subText="Review band"
            content={band.concerts[0] !== "" ? <AddReview {...{bandKey, reviewerName}}/> : "You cannot review this band because they have not played on any concerts yet."}
          />

          <InfoSnippet
            icon="thumbs_up_down"
            disableTitle
            disableHover
            orientation="portrait"
            alignSubText="center"
            subText="Band reviews"
            content={reviews[Object.keys(reviews)[0]].rating !== 0 ? <Reviews {...{reviews}}/> : "There is no reviews yet."}
          />
        </CardText>
      </Card>
    )
  }
}

const Reviews = ({reviews}) => {
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
    </div>
  )
}
