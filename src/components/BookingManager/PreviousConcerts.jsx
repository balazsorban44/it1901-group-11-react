import React, { Component } from 'react'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem'
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import {parseDate} from '../../utils'
import index from './index'

export default class PreviousConcerts extends Component{
  constructor(props) {
     super(props);
     this.state = {
       eventValue: "All events",
       genreValue:1,
       concerts: this.props.concerts,
       events : this.props.events,
       bands: this.props.bands,
       genres:["none", "All Genres", "Pop", "Rock", "Electric", "Rap", "RnB"],
     };
   }
   componentWillReceiveProps({concerts, events, bands}) {
     this.setState({concerts, events, bands})
   }

   componentDidMount(){
     this.setState({genreValue: 1})
     this.forceUpdate()

   }
   handleChangeEvent = (event, index, eventValue) => {this.setState({eventValue})}
   handleChangeGenre = (event, index, genreValue) => {this.setState({genreValue}) }

   render(){
     return(
       <div>
       <Toolbar>
         <ToolbarGroup>
         <SelectField floatingLabelText="Event" value={this.state.eventValue} onChange={this.handleChangeEvent} autoWidth={true}>
            <MenuItem value="All events" primaryText="All events" key ={"All events"}/>
            {Object.keys(this.state.events).map(key =>{
              return(
                  <MenuItem value={this.state.events[key].name} primaryText={this.state.events[key].name} key ={key}/>
              )
            })}

         </SelectField>
         </ToolbarGroup>
         <ToolbarGroup>
         <SelectField floatingLabelText="Genre" value={this.state.genreValue} onChange={this.handleChangeGenre} autoWidth={true}>
            <MenuItem value={1} primaryText="All genres" />
            <MenuItem value={2} primaryText="Pop" />
            <MenuItem value={3} primaryText="Rock" />
            <MenuItem value={4} primaryText="Electric" />
            <MenuItem value={5} primaryText="Rap" />
            <MenuItem value={6} primaryText="RnB" />
         </SelectField>
         </ToolbarGroup>
       </Toolbar>
       {Object.keys(this.state.concerts)
         .filter(concert => this.state.concerts[concert].eventName === this.state.eventValue || this.state.eventValue === "All events")
         .filter(concert => this.state.concerts[concert].genre === this.state.genres[this.state.genreValue] || this.state.genreValue === 1)
         .map(memberKey => {
         return(<ConcertSearchResult  bands = {this.state.bands} concert = {this.state.concerts[memberKey]} key={memberKey}/>)
       })}
       </div>
     )
   }
}

//Card for every concert in search result
const ConcertSearchResult = ({concert, bands}) => {
  const bandRef = concert.band
  const band = bands[bandRef]
  return(
    <Card className="concert-search">
      <CardHeader title={band.name} subtitle={band.genre} actAsExpander={true} showExpandableButton={true}/>
      <CardText expandable={true}>
      <p>From: {parseDate(concert.from)}</p>
      <p>To: {parseDate(concert.to)}</p>
      <p>Tickets sold: {concert.participants} </p>
      </CardText>
    </Card>
  )
}
