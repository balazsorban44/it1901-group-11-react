import React, {Component} from 'react'
import {List} from 'material-ui/List'
import FontIcon from 'material-ui/FontIcon'
import Chip from 'material-ui/Chip'
import {Card, CardText, CardMedia, CardTitle} from 'material-ui/Card'
import Reviews, {AddReview} from './Reviews'
import TechnicalRequirements from './TechnicalRequirements'

import Concerts from './Concerts'
import firebase from 'firebase'
import {InfoSnippet, parseNumber, muiTheme} from '../../utils'
import cover from '../../img/musician.jpg'

//Card for every band in search results
export default class Band extends Component {
  constructor(props) {
    super(props)
    const {
      showAlbumSales, showMonthlyListeners, showGenre, showManager,
      showBandMembers,
      showRequirements, canEditRequirements,
      showPreviousConcerts, showFutureConcerts,
      canAddReview, showReviews,
    } = props

    this.state = {
      manager: {},
      cover,
      showAlbumSales, showMonthlyListeners, showGenre, showManager,
      showBandMembers,
      showRequirements, canEditRequirements,
      showPreviousConcerts, showFutureConcerts,
      canAddReview, showReviews,
    }
  }

  componentDidMount() {
    const db = firebase.database().ref()
    const profilesRef = db.child('staff/profiles')
    profilesRef.child(this.props.band.manager).on('value', snap => {
      this.setState({manager: snap.val()})
    })

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
    const {
      manager: {name: managerName, email},
      cover,
      showAlbumSales, showMonthlyListeners, showGenre, showManager,
      showBandMembers,
      showRequirements, canEditRequirements,
      showPreviousConcerts, showFutureConcerts,
      canAddReview, showReviews
    } = this.state
    if (concerts) {
      concerts = Object.keys(concerts)
      .filter(key => band.concerts.includes(key))
      .reduce((obj, key) => {
        obj[key] = concerts[key]
        return obj
      }, {})
    }

    const {name, genre, albumSales, monthlyListeners, technicalRequirements, reviews, members} = band
    return (
      <Card style={{maxWidth: 720, margin: "1em auto"}}>
        <CardMedia actAsExpander overlay={<CardTitle title={name} subtitle="click for more"/>}>
          <img style={{minHeight: 160, backgroundColor: "grey"}} src={cover} alt={name}/>
        </CardMedia>
        <CardText expandable>
          <List style={{display: "flex", flexWrap: "wrap"}}>
            <AlbumSales {...{showAlbumSales, albumSales}}/>
            <Genre {...{showGenre, genre}}/>
            <MonthlyListeners {...{showMonthlyListeners, monthlyListeners}}/>
            <BandManager {...{showManager, email, managerName}}/>
          </List>
          <BandMembers {...{showBandMembers, members}}/>
          <TechnicalRequirements {...{showRequirements, canEditRequirements, technicalRequirements, bandKey}}/>
          <Concerts {...{concerts, showPreviousConcerts, showFutureConcerts}}/>
          <AddReview {...{canAddReview, reviewerName, bandKey, concerts}}/>
          <Reviews {...{reviews, showReviews}}/>
        </CardText>
      </Card>
    )
  }
}


const BandManager = ({showManager, managerName, email}) => (
  <div>
    {showManager &&
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
  </div>
)


const AlbumSales = ({showAlbumSales, albumSales}) => (
  <div>
    {showAlbumSales &&
      <InfoSnippet
        icon="album"
        subText="Album sales"
        content={parseNumber(albumSales)}
      />}
  </div>
)


const Genre = ({showGenre, genre}) => (
  <div>
    {showGenre &&
      <InfoSnippet
        icon="fingerprint"
        subText="Genre"
        content={genre}
      />}
  </div>
)


const MonthlyListeners = ({showMonthlyListeners, monthlyListeners}) => (
  <div>
    {showMonthlyListeners &&
      <InfoSnippet
        icon="music_note"
        subText="Monthly listeners"
        content={parseNumber(monthlyListeners)}
      />}
  </div>
)


const BandMembers = ({showBandMembers, members}) => (
  <div>
    {showBandMembers &&
      <InfoSnippet
        disableHover
        disableTitle
        icon="people"
        subText="Band members"
      >
        <div style={{display: "flex", flexWrap: "wrap"}}>
          {members.map(member => <Chip style={{margin: "0 .6em .6em 0"}} key={member}>{member}</Chip>)}
        </div>

      </InfoSnippet>
    }
  </div>
)
