import React, { Component } from 'react'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import {Card, CardHeader, CardText} from 'material-ui/Card'
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar'
import {parseDate, Icon} from '../../utils'

export default class PreviousConcerts extends Component {
  constructor(props) {
    super(props)
      this.state = {
      eventValue: "All events",
      genreValue:1,
      concerts: this.props.concerts,
      events : this.props.events,
      bands: this.props.bands,
      genres:["none", "All Genres", "Pop", "Rock", "Electric", "Rap", "RnB"],
    }
  }

  componentWillReceiveProps({concerts, events, bands}) {
    this.setState({concerts, events, bands})
  }

  componentDidMount() {
    this.setState({genreValue: 1})
    this.forceUpdate()
  }

  handleChangeEvent = (event, index, eventValue) => {this.setState({eventValue})}
  handleChangeGenre = (event, index, genreValue) => {this.setState({genreValue})}

  render() {
    const {eventValue, events, genreValue, concerts, genres, bands} = this.state
    return(
      <div>
        <Toolbar>
          <ToolbarGroup>
            <SelectField floatingLabelText="Event" value={eventValue} onChange={this.handleChangeEvent} autoWidth>
              <MenuItem value="All events" primaryText="All events" key ={"All events"}/>
              {Object.keys(events).map(key => {
                const {name} = events[key]
                return <MenuItem value={name} primaryText={name} key ={key}/>
              })}
            </SelectField>
          </ToolbarGroup>
          <ToolbarGroup>
            <SelectField floatingLabelText="Genre" value={genreValue} onChange={this.handleChangeGenre} autoWidth>
              <MenuItem value={1} primaryText="All genres"/>
              <MenuItem value={2} primaryText="Pop"/>
              <MenuItem value={3} primaryText="Rock"/>
              <MenuItem value={4} primaryText="Electric"/>
              <MenuItem value={5} primaryText="Rap"/>
              <MenuItem value={6} primaryText="RnB"/>
            </SelectField>
          </ToolbarGroup>
        </Toolbar>
        <div className="search">
          {Object.keys(concerts)
            .filter(concert => concerts[concert].eventName === eventValue || eventValue === "All events")
            .filter(concert => concerts[concert].genre === genres[genreValue] || genreValue === 1)
            .map(memberKey => <ConcertSearchResult key={memberKey} bands={bands} concert={concerts[memberKey]}/>)
          }
        </div>
      </div>
     )
   }
}

//Card for every concert in search result
const ConcertSearchResult = ({concert, bands}) => {
  const bandKey = concert.band
  const band = bands[bandKey]
  const {name, genre} = band
  const {from, to, participants} = concert
  return (
    <Card className="search-result">
      <CardHeader title={name} subtitle={genre} actAsExpander showExpandableButton/>
      <CardText expandable>
        <h6><Icon name="event"/>From: {parseDate(from)}</h6>
        <h6><Icon name="event"/>To: {parseDate(to)}</h6>
        <h6><Icon name="attach_money"/>Tickets sold: {participants}</h6>
      </CardText>
    </Card>
  )
}
