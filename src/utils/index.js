import React from 'react'
import CircularProgress from 'material-ui/CircularProgress'
import FontIcon from 'material-ui/FontIcon'

// Parse any date into an ISOString and returns a slice of it. For example: "1970-01-01T00:00:00.000Z"
const dateParser = (from, to,...date) => new Date(...date).toISOString().slice(from, to)
// Parse a date. Returns "1970-01-01"
export const parseDate = (...date) => {
  try {
     return dateParser(0, 10, ...date)
  } catch(e) {
    console.log("Invalid date!");
    console.error(e)
    return dateParser(Date.now())
  }
}
// Parse a time. Returns 00:00
export const parseTime = (...date) => dateParser(11, 16, ...date)

export const capitalize = s => (s.charAt(0).toUpperCase() + s.slice(1)).replace(/([a-z])([A-Z][a-z])/g, "$1 $2")

export const Loading = () => (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "70vh",
  }}><CircularProgress/></div>
)

export const Icon =({name, title}) => <FontIcon title={title ? title : name} style={{color: "grey", margin: "0 .5em"}} className="material-icons">{name}</FontIcon>

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
