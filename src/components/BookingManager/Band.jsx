import React from 'react'
import Chip from 'material-ui/Chip'
import {List} from 'material-ui/List'
import {Card, CardHeader, CardText} from 'material-ui/Card'
import AddReview from './AddReview'
import Concerts from './Concerts'

import {InfoSnippet, parseNumber} from '../../utils'
//Card for every band in search results
export const Band = ({bandKey, band, concerts}) => {
const {name, genre, albumSales, monthlyListeners, technicalRequirements} = band
  return (
    <Card className="search-result">
      <CardHeader title={<h2 style={{lineHeight: 1.2}}>{name}</h2>} actAsExpander showExpandableButton/>
      <CardText expandable>
        <List style={{display: "flex"}}>
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
        <Concerts {...{band, concerts}}/>

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

export default Band
