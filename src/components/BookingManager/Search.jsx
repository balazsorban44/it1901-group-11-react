import React, { Component } from 'react'
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import SelectField from 'material-ui/SelectField';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';

import {parseDate} from '../../utils'


export default class Search extends Component{
  constructor(props) {
    super(props);
    this.state = {
      value: 1,
      bands:{},
      concerts:{},
      input:"",
      bandsToOutput : [],
      genres:["none", "All Genres", "Pop", "Rock", "Electric", "Rap", "RnB"]
    };
  }

   componentDidMount() {
     const {bands, concerts} = this.props
     this.setState({bands, concerts})
   }

//Search for band containing strings in input and update bandsToOutput state
   searchForBand(input, directValue){
     let {bands, genres, value} = this.state
     //HACK to get updated value when changing genre. State do not change fast enough
     if(directValue !=null){
       value = directValue
     }
     let bandsToOutput = []
     Object.keys(bands).forEach(key =>{
       const {name, genre} = bands[key]
       if(name.toLowerCase().includes(input.toLowerCase()) &&(genres[value] === genre || value === 1)){
         bandsToOutput.push(key)
       }
     })
     this.setState({bandsToOutput, input})
   }
//onChange genre dropdown list
  handleChange = (event, index, value) => {
    this.setState({value})
    this.searchForBand(this.state.input, value)
  }

   render(){
     return(
       <div>
         <Toolbar>
           <ToolbarGroup>
             <ToolbarTitle text="" />
             <TextField  fullWidth hintText="Search for band" onChange = {input => this.searchForBand(input.target.value)}/>
             <FontIcon className="material-icons">search</FontIcon>
           </ToolbarGroup>
           <ToolbarGroup>
             <SelectField value={this.state.value} onChange={this.handleChange} autoWidth={true}>
               <MenuItem value={1} primaryText="All genres" />
               <MenuItem value={2} primaryText="Pop" />
               <MenuItem value={3} primaryText="Rock" />
               <MenuItem value={4} primaryText="Electric" />
               <MenuItem value={5} primaryText="Rap" />
               <MenuItem value={6} primaryText="RnB" />
             </SelectField>
           </ToolbarGroup>
         </Toolbar>
         <div className="band-search">
           {Object.keys(this.state.bandsToOutput).map(memberKey => {
             const band = this.state.bands[this.state.bandsToOutput[memberKey]]
             const key = this.state.bandsToOutput[memberKey]
             const concerts = this.state.concerts
             return(<BandSearchResult concerts = {concerts} band = {band} key={key}/>)
           })}
         </div>
       </div>
     )
   }
}

//Card for every band in search results
const BandSearchResult = ({band, concerts}) => (
  <Card className="band-search-result">
    <CardHeader title={band.name} subtitle={band.genre} actAsExpander={true} showExpandableButton={true}
    />
    <CardText expandable={true}>
      <p>Album sales: {band.albumSales}</p>
      <p>Monthly listeners: {band.monthlyListeners}</p>
      <p>Previous concerts: </p>
      {Object.keys(band.concerts).map(keyd =>{
        const concert = concerts[band.concerts[keyd]]
        if (!concert) {
          return <div key={Math.random()}></div>
        } else {
          return(
            <div key = {band.concerts[keyd]}>
              <p>{parseDate(concert.from)} Tickets sold: {concert.participants}</p>
            </div>
          )}
      }
      )}
    </CardText>
  </Card>
)
