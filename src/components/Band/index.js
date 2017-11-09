import React, {Component} from 'react'
import {List} from 'material-ui/List'
import Divider from 'material-ui/Divider'
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
  constructor() {
    super()

    this.state = {
      manager: {},
      summary: "",
      lastFMLink: "",
      cover
    }
  }

  componentDidMount() {
    const db = firebase.database().ref()
    const profilesRef = db.child('staff/profiles')
    const {band: {name, manager}} = this.props
    profilesRef.child(manager).on('value', snap => {
      this.setState({manager: snap.val()})
    })

    fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${name}&api_key=35f1b3f9790cddd48125c3b2acaae8a4&format=json`)
    .then(response => {
      if (response.ok) {
        response.json().then(({artist}) => {
          let {
            bio: {summary},
            // image,
            // stats:{listeners}
          } = artist
          // bandKey && firebase.database().ref(`bands/${bandKey}/monthlyListeners`).set(parseInt(listeners,10))
          const lastFMLink = summary.split('href="')[1].split('">')[0]
          summary = summary.split('<a')[0]
          // const cover = image[4]["#text"].replace("300x300", "600x600")
          // cover !== "" && this.setState({cover})
          this.setState({summary, lastFMLink})
      })}
    })
  }

  render() {
    let {
      headerType, title, subtitle,
      bandKey, band, concerts, reviewerName,
      showAlbumSales, showMonthlyListeners, showGenre, showManager,
      showBandMembers,
      showRequirements, canEditRequirements,
      showPreviousConcerts, showFutureConcerts,
      canAddReview, showReviews
    } = this.props

    const {
      manager: {name: managerName, email},
      cover, summary, lastFMLink
    } = this.state

    if (concerts) {
      concerts = Object.keys(concerts)
      .filter(concertKey => {
        const {band, isAcceptedByBookingBoss} = concerts[concertKey]
        return  band === bandKey && isAcceptedByBookingBoss !== "unhandled"
      } )
      .reduce((filteredConcerts, concertKey) => {
        filteredConcerts[concertKey] = concerts[concertKey]
        return filteredConcerts
      }, {})
    }

    const {name, genre, albumSales, monthlyListeners, technicalRequirements, reviews, members} = band
    return (
      <Card style={{margin: "1em"}}>
        {{
          "compact":
          <CardTitle style={{paddingBottom: 8}} actAsExpander>
            <div style={{display: "flex"}}>
              <div style={{
                position: "relative",
                width: 128,
                height: 128,
                overflow: "hidden",
                backgroundColor: "pink"
              }}>
                <img
                  style={{
                    height: "100%",
                    backgroundColor: "grey",
                    filter: "grayscale(1)"
                  }}
                  src={cover}
                  alt={name}
                />
                <div style={{
                  top: 0,
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  zIndex: 1,
                  overflow: "hidden",
                  backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,.4) 0%, rgba(229, 28, 40, 0.5) 100%)"
                }}/>
              </div>
              <div style={{flexGrow: 1}}>
                <h6 >{title}</h6>
                <div style={{textAlign: "center"}}>{subtitle}</div>
              </div>
              <Icon color="black" name="keyboard_arrow_down"/>
            </div>
          </CardTitle>,
          "big": <CardMedia
            className="band-cover"
            overlayContentStyle={{
              background: "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,.6))"
            }}
            actAsExpander
            overlay={
              <CardTitle title={<div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end"}}>
                <span>{title}</span>
                <Icon color="white" name="keyboard_arrow_down"/>
              </div>} subtitle={subtitle}/>
            }>
            <img style={{backgroundColor: "grey"}} src={cover} alt={name}/>
          </CardMedia>

        }[headerType]}

        <CardText expandable>
          {headerType === "compact" && <Divider/>}
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
    orientation="portrait"
    disableHover
    icon="info"
    subText="Summary"
    content={
      <div>
        <p style={{textAlign: "left"}}>{summary}</p>
        <a style={{fontSize: ".8em", color: muiTheme.palette.accent1Color}} href={lastFMLink}>more on Last.FM</a>
      </div>
    }
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
