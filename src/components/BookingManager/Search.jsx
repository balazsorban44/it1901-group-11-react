import React, { Component } from 'react'
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField'
import {Icon} from '../../utils'
import SelectField from 'material-ui/SelectField'
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar'
import Band from '../Band'
import {Loading, NoResult} from '../../utils'


export default class Search extends Component{
  constructor(props) {
    super(props)
    const {bands, concerts, events, scenes} = props
    this.state = {
      input: "",
      genre: "All genres",
      eventValue: "All events",
      sceneValue: "All events",
      bands,
      concerts,
      events,
      scenes,

      bandsToOutput : bands && Object.keys(bands),
    }
  }

  componentWillReceiveProps({bands, concerts, events, scenes, name}) {
    if (bands && concerts && name) {
      this.setState({
        bands,
        bandsToOutput: Object.keys(bands),
        concerts,
        events,
        scenes,
        name
      })
    }
    else this.setState({bandsToOutput: null})
  }


  //Search for band containing strings in input and update bandsToOutput state
  searchForBand = () => {
    let {bands, genre, input} = this.state
    let bandsToOutput = Object.keys(bands).filter(bandKey => bands[bandKey].name.toLowerCase().includes(input))
    if (genre !== "All genres"){
      bandsToOutput = bandsToOutput.filter(bandKey => genre === bands[bandKey].genre)
    }
    this.setState({bandsToOutput})
  }

//Handle input from search
  handleInputChange = e => {
    const input = e.target.value.toLowerCase()
    this.setState({input}, () => this.searchForBand())
  }

  //onChange genre dropdown list
  handleGenreChange = (event, index, value) => {
    this.setState({genre:value}, () => this.searchForBand())
  }
  handleEventChange = (event, index, eventValue) => {this.setState({eventValue})}

   render(){
     const {genre, bandsToOutput, bands, concerts, events, scenes, name, eventValue, sceneValue} = this.state

     return(
       <div>
         <Toolbar className="band-search-toolbar">
           <ToolbarGroup>
             <TextField  fullWidth hintText="Search for band" onChange={this.handleInputChange}/>
             <Icon name="search" color="grey"/>
           </ToolbarGroup>
           <ToolbarGroup>
             <SelectField value={genre} onChange={this.handleGenreChange} autoWidth>
               <MenuItem value={"All genres"} primaryText="All genres" />
               <MenuItem value={"Pop"} primaryText="Pop" />
               <MenuItem value={"Rock"} primaryText="Rock" />
               <MenuItem value={"Electric"} primaryText="Electric" />
               <MenuItem value={"Rap"} primaryText="Rap" />
               <MenuItem value={"RnB"} primaryText="RnB" />
             </SelectField>
           </ToolbarGroup>

           <ToolbarGroup>
             <SelectField floatingLabelText="Event" value={eventValue} onChange={this.handleEventChange} autoWidth>
               <MenuItem value="All events" primaryText="All events" key ={"All events"}/>
               {Object.keys(events).map(key => {
                 const {name} = events[key]
                 return <MenuItem value={name} primaryText={name} key ={key}/>
               })}
             </SelectField>
           </ToolbarGroup>

         </Toolbar>
         <div className="search">
           {bands && concerts ?
             bandsToOutput.map(bandKey => (
               <Band
                 showAlbumSales showMonthlyListeners showGenre showManager
                 showPreviousConcerts
                 showRequirements
                 canAddReview reviewerName={name}
                 key={bandKey}
                 {...{bandKey, concerts}}
                 band={bands[bandKey]}
               />
             )) :
             <Loading/>
           }
           {bandsToOutput && !bandsToOutput.length && <NoResult/>}
         </div>
       </div>
     )}
 }
