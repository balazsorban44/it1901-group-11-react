import React from 'react'
import CircularProgress from 'material-ui/CircularProgress'
import FontIcon from 'material-ui/FontIcon'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import {amber500, amber700} from 'material-ui/styles/colors'
import {List, ListItem} from 'material-ui/List'

import 'datejs'

export const muiTheme = getMuiTheme({
  palette: {
    primary1Color: "#f8c53b",
    primary2Color: amber500,
    primary3Color: amber700,
    accent1Color: "#ea4a53"
  },
})

export const profiles = require.context('../img/profiles')

// Parse a date. Returns "01. Jan 1970"
export const parseDate = (...date) => new Date(...date).toString('dd. MMM yyyy')
// Parse a time. Returns "00:00"
export const parseTime = (...date) => new Date(...date).toString('HH:mm')

export const parseNumber = num => num.toLocaleString()

export const parsePrice = price => price.toLocaleString('no-NO', {style: "currency", currency: "NOK"})

export const capitalize = s => (s.charAt(0).toUpperCase() + s.slice(1)).replace(/([a-z])([A-Z][a-z])/g, "$1 $2")

export const Loading = () => (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "70vh",
  }}><CircularProgress/></div>
)

export const Icon =({name, title, color}) => (
  <FontIcon
    title={title ? title : name}
    style={{
      color: color ? color : "#ea4a53",
      margin: "0 .5em"
    }}
    className="material-icons"
  >{name}
  </FontIcon>
)

export const NoResult = () => (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "70vh",
  }}>
    <div style={{display: "flex", alignItems: "center"}}>
      <p style={{color:"grey"}}>
        This is not the search result you are looking for.
      </p>
      <Icon name="sentiment_dissatisfied"/>
    </div>
  </div>
)

export const InfoSnippet = ({icon, content, children, subText, disableTitle, disableHover, alignSubText, orientation}) => (
  <ListItem disabled={disableHover} title={disableTitle ? "" : subText}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: orientation === "portrait" && window.innerWidth < 768 && "column"
      }}
    >
      <Icon
        name={icon}
        title={subText}
      />
      <div style={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: alignSubText ? alignSubText : "flex-start"
      }}>
        <div
          style={{
            flexGrow: 1,
            margin: 0,
            fontSize: "1.1em"
          }}
        >{children ? children : content}</div>
        <h6
          style={{
            lineHeight: 1,
            flexGrow: 1,
            padding: 0,
            color: "grey",
            fontSize: ".9em"
          }}
        >{subText}</h6>
      </div>
    </div>
  </ListItem>
)

export const Review = ({reviews}) => (
  <List>
    {Object.keys(reviews).map(key => {
      const {content, rating} = reviews[key]
      return(
        <ListItem key={key}>
          <Rating {...{rating}}/>
          <p>{content}</p>
        </ListItem>
      )
    })}
  </List>
)

export const Rating = ({rating, editable, handleRatingChange}) =>  {
  let stars = []
  for(let i = 1; i < 6; i++) {
    stars.push(
      <li
        style={editable && {cursor: "pointer"}}
        key={i}
        onClick={() => editable && handleRatingChange(i)}
      >
        <Icon name={`star${i<=rating ? "" : "_border"}`}/>
      </li>
    )
  }
  return (
    <ul style={{display: "flex"}}>
      {stars}
    </ul>
  )
}
