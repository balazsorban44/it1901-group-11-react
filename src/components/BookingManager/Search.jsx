import React, { Component } from 'react'
import firebase from 'firebase'
import Paper from 'material-ui/Paper';
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import {Card, CardHeader, CardText} from 'material-ui/Card';
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

   componentDidMount(){
     const db = firebase.database().ref()
     const bandsRef = db.child('bands')
     const concertsRef = db.child('concerts')
     bandsRef.on('value', snap =>{
       const bands = snap.val()
       this.setState({bands})
     })
     concertsRef.on('value', snap =>{
       const concerts = snap.val()
       this.setState({concerts})
     })
   }

   doSearch(input, directValue){
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
    this.doSearch(this.state.input, value)
  }

   render(){
     return(
       <Paper className = "BookingManagerMakeOfferBox">
         <h1>Search</h1>
         <TextField hintText="Search for band" onChange = {input => this.doSearch(input.target.value)}/><br/>
         <SelectField floatingLabelText="Genre" value={this.state.value} onChange={this.handleChange} autoWidth={true}>
          <MenuItem value={1} primaryText="All genres" />
          <MenuItem value={2} primaryText="Pop" />
          <MenuItem value={3} primaryText="Rock" />
          <MenuItem value={4} primaryText="Electric" />
          <MenuItem value={5} primaryText="Rap" />
          <MenuItem value={6} primaryText="RnB" />
         </SelectField>
       <div>
        {Object.keys(this.state.bandsToOutput).map(memberKey => {
           const band = this.state.bands[this.state.bandsToOutput[memberKey]]
           const key = this.state.bandsToOutput[memberKey]
           const concerts = this.state.concerts
           //TODO fix unique key warning
           return(<BandSearchResults concerts = {concerts} band = {band} key={key}/>)
        })}
       </div>
       </Paper>
     )
   }
}

const BandSearchResults = ({band, concerts}) => (
  <Card>
    <CardHeader title={band.name} subtitle={band.genre} actAsExpander={true} showExpandableButton={true}
    />
    <CardText expandable={true}>
      <p>Album sales: {band.albumSales}</p>
      <p>Monthly listeners: {band.monthlyListeners}</p>
      <p>Previous concerts: </p>
      {Object.keys(band.concerts).map(keyd =>{
            const concert = concerts[band.concerts[keyd]]
            if(typeof concert === 'undefined'){
              return(<div></div>)
            }
            return(
              <div key = {band.concerts[keyd]}>
                <p>{parseDate(concert.from)} Tickets sold: {concert.participants}</p>
              </div>
            )})}
    </CardText>
  </Card>
)
