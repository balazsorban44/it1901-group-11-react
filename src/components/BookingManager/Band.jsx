import React, {Component} from 'react'
import Chip from 'material-ui/Chip'
import {List} from 'material-ui/List'
import FontIcon from 'material-ui/FontIcon'
import {Card, CardHeader, CardText, CardMedia, CardTitle} from 'material-ui/Card'
import AddReview from './AddReview'
import Concerts from './Concerts'
import firebase from 'firebase'
import {InfoSnippet, parseNumber, muiTheme} from '../../utils'
import fanarttvAPI from 'fanarttv'


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

    const fanart = new fanarttvAPI('152d071f673f4e189fbe2a1e17606481')
    fanart.getImagesForArtist(this.props.bandKey, (err, res) => {
      if (!err) {
        this.setState({cover: res.artistbackground[1].url})
      }
    })

  }

  render() {
    let {bandKey, band, concerts} = this.props
    const {manager: {name: managerName, email}, cover} = this.state



    concerts = Object.keys(concerts)
      .filter(key => band.concerts.includes(key))
      .reduce((obj, key) => {
        obj[key] = concerts[key]
        return obj
      }, {})

    const {name, genre, albumSales, monthlyListeners, technicalRequirements} = band
    return (
      <Card className="search-result">

        {cover !== "" ?
          <CardMedia actAsExpander overlay={
            <CardTitle title={name} subtitle="click for more"/>}>
            <img src={cover} alt={name}/>
          </CardMedia> :
          <CardHeader title={<h2 style={{lineHeight: 1.2}}>{name}</h2>} actAsExpander showExpandableButton/>

        }
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
            subText="Review band"
            content={band.concerts[0] !== "" ? <AddReview {...{bandKey}}/> : "You cannot review this band because they have not played on any concerts yet."}
          />

        </CardText>
      </Card>
    )
  }
}
