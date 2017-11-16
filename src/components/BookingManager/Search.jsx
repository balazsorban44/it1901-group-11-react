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


/**
  * Search component
  */
export default class Search extends Component{
  /**
    * Search constructor
    * @param {Object} props
    */
  constructor(props) {
    super(props)
    const {bands, concerts, events, scenes} = props

    /**
      * @type {Object} state
      * @property {String} state.query - Search query
      * @property {String} state.genre - Genre of the band
      * @property {String} state.event - ID of the event the band plays on
      * @property {String} state.scene - ID of the scene the band plays on
      * @property {String} state.sortBy - Sorting criteria
      * @property {Boolean} state.isIncrease - Whether sort increasing or decreasing
      * @property {Object} state.bands - List of bands
      * @property {Object} state.concerts - List of concerts
      * @property {Object} state.events - List of events
      * @property {Object} state.scenes - List of scenes
      * @property {Array} state.bandsToOutput - List of bands to render
      */
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

  /**
    * When the component recieves new props, update the state
    * @param {Object} props
    * @param {Object} props.bands - List of bands
    * @param {Object} props.concerts - List of concerts
    * @param {Object} props.events - List of events
    * @param {Object} props.scenes - List of scenes
    * @param {String} props.name - Name of the reviewer
    */
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

  /**
    * Reset all the filters
    */
  resetFilters = () => {
    this.setState({
      query: "",
      event: null,
      scene: null,
      genre: null
    })
    this.handleFilters("event", null)
  }

  /**
    * Handle filters
    * @param {String} filterBy - Filtering criteria
    * @param {String} value - Filtering ID
    */
  handleFilters = (filterBy, value) => {
    if (filterBy === "event") {
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

  /**
    * Handle sorting
    * @param {String} sortBy - Sorting criteria
    * @param {Boolean} value - Whether sort increasing or decreasing
    */
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


  /**
    * Display Search
    * @return {JSX} Return Search
    */
   render(){
    const {
      query,
      isIncrease,
      bands, bandsToOutput,
      events, scenes,
      event, scene, genre,
      name: reviewerName
    } = this.state

    let concerts = {...this.state.concerts}

    if (event) {
      Object.keys(concerts).forEach(concertKey => {
        const filteredConcert = concerts[concertKey]
        if (filteredConcert.event !== event) {
          delete concerts[concertKey]
        }
        if (scene) {
          if (filteredConcert.scene !== scene) {
            delete concerts[concertKey]
          }
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
