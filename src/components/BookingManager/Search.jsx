import React, { Component } from 'react'
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField'
import {Icon} from '../../utils'
import SelectField from 'material-ui/SelectField'
import RaisedButton from 'material-ui/RaisedButton'
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar'
import Band from '../Band'
import {Loading, NoResult} from '../../utils'
import Masonry from 'react-masonry-css'

export default class Search extends Component{
  constructor(props) {
    super(props)
    const {bands, concerts, events, scenes} = props
    this.state = {
      query: "",
      genre: null,
      event: null,
      scene: null,
      sortBy: "",
      isIncrease: false,
      bands,
      concerts,
      events,
      scenes,
      bandsToOutput : bands ? Object.keys(bands) : null
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

  resetFilters = () => {
    this.setState({
      query: "",
      event: null,
      scene: null,
      genre: null
    })
    this.handleFilters("event", null)
  }
  handleFilters = (filterBy, value) => {
    if (filterBy === "event" && value === null) {
      this.setState({scene: null})
    }
    this.setState({[filterBy]: value}, () => {
      const {
        bands, concerts,
        query, event, scene, genre
      } = this.state

      let bandsToOutput = Object.keys(bands)
      bandsToOutput = bandsToOutput
      // Filter by Search query
      .filter(bandKey => bands[bandKey].name.toLowerCase().includes(query))
      // Filter by genre
      .filter(bandKey => (genre ? bands[bandKey].genre === genre : bandKey))
      //Filter by event

      .filter(bandKey => (event ?
        bands[bandKey].concerts.some(concertKey => concerts[concertKey] && concerts[concertKey].event === event) : bandKey
      ))
      // Filter by scene
      .filter(bandKey => (scene ?
        bands[bandKey].concerts.some(concertKey => concerts[concertKey] && concerts[concertKey].scene === scene) : bandKey
      ))

      this.setState({bandsToOutput})
    })
  }


  handleSorters = (sortBy, isIncrease) => {
    let {bands, bandsToOutput} = this.state
    let filtered = bandsToOutput.map(bandKey => [bandKey, bands[bandKey]])
    filtered.sort((a, b) => ( isIncrease ?
      a[1][sortBy].toString().localeCompare(b[1][sortBy].toString()):
      b[1][sortBy].toString().localeCompare(a[1][sortBy].toString())
    ))
    bandsToOutput = filtered.map(band => band[0])
    this.setState({bandsToOutput, isIncrease})
  }

   render(){
    const {
      query,
      isIncrease,
      bands, bandsToOutput,
      concerts, events, scenes,
      event, scene, genre,
      name: reviewerName
    } = this.state

    const filteredConcerts = {}

    if (scene) {
      Object.keys(filteredConcerts).forEach(concertKey => {
        const filteredConcert = concerts[concertKey]
        if (scene && filteredConcert.scene === scene) {
          filteredConcerts[concertKey] = filteredConcert
        }
      })
    }

     return(
       <div>
         <Toolbar>
           <div style={{width: "100%",display: "flex", alignItems: "center"}}>
             <TextField
               fullWidth
               hintText="Search for band"
               value={query}
               onChange={({target:{value}}) => this.handleFilters("query", value.toLowerCase())}
             />
             <Icon name="search" color="grey"/>
           </div>
         </Toolbar>
         <Toolbar >
           <ToolbarGroup>
             <ToolbarTitle text="Filter"/>
             <SelectField
               value={event}
               onChange={(event, index, value) => this.handleFilters("event", value)}
             >
               <MenuItem key="All events" value={null} primaryText="All events"/>
               {events && Object.keys(events).map(eventKey => (
                 <MenuItem
                   key={eventKey}
                   value={eventKey}
                   primaryText={events[eventKey].name}
                 />
               )
               )}
             </SelectField>
             <SelectField
               value={scene}
               onChange={(event, index, value) => this.handleFilters("scene", value)}
             >
               <MenuItem key="All scene" value={null} primaryText="All scene"/>
               {event && events[event].scenes.map(sceneKey => (
                 <MenuItem
                   key={sceneKey}
                   value={sceneKey}
                   primaryText={scenes[sceneKey].name}
                 />
               ))}
             </SelectField>
             <SelectField value={genre} onChange={(event, index, value) => this.handleFilters("genre", value)} >
               <MenuItem value={null} primaryText="All genres" />
               <MenuItem value={"Pop"} primaryText="Pop" />
               <MenuItem value={"Rock"} primaryText="Rock" />
               <MenuItem value={"Electric"} primaryText="Electric" />
               <MenuItem value={"Rap"} primaryText="Rap" />
               <MenuItem value={"RnB"} primaryText="RnB" />
             </SelectField>
           </ToolbarGroup>
           <ToolbarGroup>
             <RaisedButton label="Reset filters" onClick={this.resetFilters} primary/>
             {bandsToOutput && `${bandsToOutput.length} result(s)`}
           </ToolbarGroup>
         </Toolbar>
         <Toolbar>
           <ToolbarGroup>
             <ToolbarTitle text="Sort by"/>
             <div style={{display: "flex", cursor: "pointer"}} onClick={() => this.handleSorters("name", !isIncrease)}>
               <p>Name</p>
               <Icon name="sort_by_alpha"/>
             </div>
             <div style={{display: "flex", cursor: "pointer"}} onClick={() => this.handleSorters("genre", !isIncrease)}>
               <p>Genre</p>
               <Icon name="sort"/>
             </div>
           </ToolbarGroup>
         </Toolbar>
         <Masonry
           breakpointCols={{
             default: 2,
             960: 1
           }}
           style={{
             margin: "0 auto",
             paddingLeft: 20,
             display: "flex",
             width: "100vw"
           }}
           columnClassName="band-list-column"
         >
           {bandsToOutput ?
             bandsToOutput.map(bandKey => {
               const band = bands[bandKey]
               const {name, genre} = band
               return(
                 <Band
                   key={bandKey}
                   headerType={'big'}
                   title={name}
                   subtitle={genre}
                   showAlbumSales showMonthlyListeners showGenre showManager
                   showPreviousConcerts showFutureConcerts
                   showRequirements
                   canAddReview
                   concerts={filteredConcerts}
                   {...{bandKey, band, concerts, reviewerName}}
                 />
               )
             }) :
             <Loading/>
           }
         </Masonry>
         {bandsToOutput && !bandsToOutput.length && <NoResult text={"This is not the search result you are looking for."}/>}
       </div>
     )}
 }
