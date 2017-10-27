import React, { Component } from 'react'
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField'
import {Icon} from '../../utils'
import SelectField from 'material-ui/SelectField'
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar'
import Band from '../Band'
import {Loading, NoResult} from '../../utils'
import Masonry from '../../utils/react-masonry-css'


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



  handleFilters = (key, type) => {
    this.setState({[type]: key}, () => {
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
      // Filter by event
      .filter(bandKey => (event ?
        bands[bandKey].concerts.some(concertKey => concerts[concertKey] && concerts[concertKey].event !== event) : bandKey
      ))
      // Filter by scene
      .filter(bandKey => (scene ?
        bands[bandKey].concerts.some(concertKey => concerts[concertKey] && concerts[concertKey].scene !== scene) : bandKey
      ))

      this.setState({bandsToOutput}, () => this.handleSorters("name", true))
    })
  }


  handleSorters = (sortBy, isIncrease) => {
    let {bands, bandsToOutput} = this.state
    let filtered = bandsToOutput.map(bandKey => [bandKey, bands[bandKey]])
    filtered.sort((a, b) => (isIncrease ?
      // FIXME: toString() sorts (as should have been expected) strings, not integers.
      // For example: 99 > 980
      a[1][sortBy].localeCompare(b[1][sortBy]) :
      b[1][sortBy].localeCompare(a[1][sortBy]))
    )
    bandsToOutput = filtered.map(band => band[0])
    this.setState({bandsToOutput, isIncrease})
  }

   render(){
    const {
      isIncrease,
      bands, bandsToOutput,
      concerts, events, scenes,
      event, scene, genre,
      name: reviewerName
    } = this.state


     return(
       <div>
         <Toolbar>
           <div style={{width: "100%",display: "flex", alignItems: "center"}}>
             <TextField
               fullWidth
               hintText="Search for band"
               onChange={({target:{value}}) => this.handleFilters(value.toLowerCase(), "query")}
             />
             <Icon name="search" color="grey"/>
           </div>
         </Toolbar>
         <Toolbar >
           <ToolbarGroup>
             <ToolbarTitle text="Filter"/>
             <SelectField
               value={event}
               onChange={(event, index, value) => this.handleFilters(value, "event")}
             >
               <MenuItem key="All events" value={null} primaryText="All events"/>
               {Object.keys(events).map(eventKey => (
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
               onChange={(event, index, value) => this.handleFilters(value, "scene")}
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
             <SelectField value={genre} onChange={(event, index, value) => this.handleFilters(value, "genre")} >
               <MenuItem value={null} primaryText="All genres" />
               <MenuItem value={"Pop"} primaryText="Pop" />
               <MenuItem value={"Rock"} primaryText="Rock" />
               <MenuItem value={"Electric"} primaryText="Electric" />
               <MenuItem value={"Rap"} primaryText="Rap" />
               <MenuItem value={"RnB"} primaryText="RnB" />
             </SelectField>
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
             <div style={{display: "flex", cursor: "pointer"}} onClick={() => this.handleSorters("monthlyListeners", !isIncrease)}>
               <p>Monthly listeners</p>
               <Icon name="sort"/>
             </div>
             <div style={{display: "flex", cursor: "pointer"}} onClick={() => this.handleSorters("albumSales", !isIncrease)}>
               <p>Album sales</p>
               <Icon name="sort"/>
             </div>
           </ToolbarGroup>
         </Toolbar>
         <Masonry
           breakpointCols={{
             default: 3,
             1440: 2,
             1024: 1
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
                   showPreviousConcerts
                   showRequirements
                   canAddReview
                   {...{bandKey, band, concerts, reviewerName}}
                 />
               )
             }) :
             <Loading/>
           }
         </Masonry>
         {bandsToOutput && !bandsToOutput.length && <NoResult/>}
       </div>
     )}
 }
