import React, {Component} from 'react'
import {List} from 'material-ui/List'
import FontIcon from 'material-ui/FontIcon'
import Chip from 'material-ui/Chip'
import {Card, CardText, CardMedia, CardTitle} from 'material-ui/Card'
import Reviews, {AddReview} from './Reviews'
import TechnicalRequirements from './TechnicalRequirements'

import Concerts from './Concerts'
import firebase from 'firebase'
import {InfoSnippet, parseNumber, muiTheme, Icon} from '../../utils'
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
      summary: "",
      lastFMLink: "",
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

    fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${this.props.band.name}&api_key=35f1b3f9790cddd48125c3b2acaae8a4&format=json`)
    .then(response => {
      if (response.ok) {
        response.json().then(({artist}) => {
          let {bio: {summary}, image} = artist
          const lastFMLink = summary.split('href="')[1].split('">')[0]
          summary = this.props.band.name === "Fantastic Five" ? "Thie is the most amazing band in the world!" : summary.split('<a')[0]
          const cover = image[4]["#text"].replace("/300x300", "")
          cover !== "" && this.setState({cover})
          this.setState({summary, lastFMLink})
      })}
    })
  }

  render() {
    let {bandKey, band, concerts, reviewerName} = this.props
    const {
      manager: {name: managerName, email},
      cover, summary, lastFMLink,
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
      <Card style={{maxWidth: 640, margin: "1em auto"}}>
        <CardMedia className="band-cover" actAsExpander overlay={
          <CardTitle title={<div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end"}}>
            <span>{name}</span>
            <Icon color="white" name="keyboard_arrow_down"/>
          </div>} subtitle={genre}/>
        }>
          <img style={{

              backgroundColor: "grey"
          }} src={cover} alt={name}/>
        </CardMedia>
        <CardText expandable >
          <Summary {...{summary, lastFMLink}}/>
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
        disableHover
        icon="business"
        subText="Band manager"
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

const Summary = ({summary, lastFMLink}) => (
  <InfoSnippet
    disableHover
    icon="info"
    subText="Summary"
    content={<p style={{textAlign: "left"}}>{summary} <a style={{color: muiTheme.palette.accent1Color}} href={lastFMLink}>read more on LastFM</a></p>}
  />
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
