import React from 'react'
import CircularProgress from 'material-ui/CircularProgress'
import FontIcon from 'material-ui/FontIcon'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import {amber500, amber700} from 'material-ui/styles/colors'
import {List, ListItem} from 'material-ui/List'

import 'datejs'


/**
 * Define the basic colors of the page
 */
export const muiTheme = getMuiTheme({
  palette: {
    primary1Color: "#f8c53b",
    primary2Color: amber500,
    primary3Color: amber700,
    accent1Color: "#ea4a53"
  },
})


/**
* Dynamic fethcing of profile pictures.
*/
export const profiles = require.context('../img/profiles')


/**
 * Parse a date object into a date string
 * @param {Date} date - Takes in a Date object
 * @return {String} 01. Jan 1970
 */
export const parseDate = (...date) => new Date(...date).toString('dd. MMM yyyy')

/**
  * Parse a date object into a time string
  * @param {Date} date - Takes in a Date object
  * @return {String} 00:00
  */
export const parseTime = (...date) => new Date(...date).toString('HH:mm')

/**
* Prettify a long number
* @param {number} num - Takes in an integer
* @return {number} 1,000,000
*/
export const parseNumber = num => num.toLocaleString()

/**
* Turn a number into Norwegian Kroner price
* @param {number} price - Takes in an integer
* @return {String} NOK1,000.00
*/
export const parsePrice = price => price.toLocaleString('no-NO', {style: "currency", currency: "NOK"})

/**
* Capitalize a camelCase string
* @param {String} s - Takes in a camelCase string
* @return {String} Camel case
*/
export const capitalize = s => (s.charAt(0).toUpperCase() + s.slice(1)).replace(/([a-z])([A-Z][a-z])/g, "$1 $2")

/**
* Loading spinner
* @return {JSX} Return a spinner centralized on the screen
*/
export const Loading = () => (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "70vh",
  }}><CircularProgress/></div>
)

/**
* Display a material icon
* @param {Object} props
* @param {String} props.name - Name
* @param {String} props.title - Title
* @param {String} props.color - HEX or RGB color
* @return {JSX} Returns an icon
*/
export const Icon = ({name, title, color}) => (
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


/**
* Display something when there is no result of a search
* @param {Object} props
* @param {String} props.text - The text to show
* @return {JSX} Return the text positioned to the center of the screen
*/
export const NoResult = ({text}) => (
  <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "70vh",
  }}>
    <div style={{display: "flex", alignItems: "center"}}>
      <p style={{color:"grey"}}>{text}</p>
      <Icon name="sentiment_dissatisfied"/>
    </div>
  </div>
)


/**
  * Display a snippet of information with text and icon.
  * @param {Object} props
  * @param {String} props.icon - Icon to show on the left of the information
  * @param {String} props.content - Content of the information snippet (for less content)
  * @param {String} props.children - Content of the information snippet (for more content)
  * @param {String} props.subText - Subtext to show
  * @param {Boolean} props.disableTitle - Whether to display title on hover
  * @param {Boolean} props.disableHover - Whether to display darkened background to highlight the information
  * @param {String} props.alignSubText - Flex position of the sub text
  * @param {String} props.orientation - Orientation of the snippet. Possible values: landscape | portrait
  * @return {JSX} Return an information snippet
  */
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


/**
  * Display a list of reviews.
  * @param {Object} props
  * @param {Object} props.reviews - List of reviews
  * @return {JSX} Return an information snippet
  */
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

/**
  * Display a rating of 1 to 5 with stars.
  * @param {Object} props
  * @param {number} props.rating - Number from 1 to 5 (5 is best)
  * @param {Boolean} props.editable - Should the rating be editable
  * @param {Function} props.handleRatingChange - Function passed from parent component to handle changes of the rating value.
  * @return {JSX} Return an information snippet
  */
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
