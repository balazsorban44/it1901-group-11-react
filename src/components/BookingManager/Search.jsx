import React, { Component } from 'react'
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField'
import {Icon, InfoSnippet} from '../../utils'
import SelectField from 'material-ui/SelectField'
import Chip from 'material-ui/Chip'
import {List} from 'material-ui/List'
import {Card, CardHeader, CardText} from 'material-ui/Card'
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar'

import { Table, TableBody, TableHeader,
  TableHeaderColumn, TableRow,
  TableRowColumn
} from 'material-ui/Table'

import {parseDate, parseNumber, parsePrice, Loading, NoResult} from '../../utils'


export default class Search extends Component{
  constructor(props) {
    super(props)
    this.state = {
      input: "",
      genre: "All genres",
      bands: null,
      concerts: null,
      bandsToOutput : null,
    }
  }

  componentWillReceiveProps({bands, concerts}) {
    if (bands && concerts) {
      let bandsToOutput = Object.keys(bands).map(band => band)
      this.setState({bands, bandsToOutput, concerts})
    }
    else {
      this.setState({
        bands,
        bandsToOutput: null,
        concerts
      })
    }
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

   render(){
     const {genre, bandsToOutput, bands, concerts} = this.state
     return(
       <div>
         <Toolbar>
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
         </Toolbar>
         <div className="search">
           {bands && concerts ?
             bandsToOutput.map(key => (<BandSearchResult key={key} concerts={concerts} band={bands[key]}/>)) :
             <Loading/>}
           {bandsToOutput && !bandsToOutput.length && <NoResult/>}
         </div>
       </div>
     )}
 }

//Card for every band in search results
const BandSearchResult = ({band, concerts}) => {
const {name, genre, albumSales, monthlyListeners, technicalRequirements} = band
  return (
    <Card className="search-result">
      <CardHeader title={<h2 style={{lineHeight: 1.2}}>{name}</h2>} actAsExpander showExpandableButton/>
      <CardText expandable>
        <List>
          <InfoSnippet icon="album" subText="Album sales">{parseNumber(albumSales)}</InfoSnippet>
          <InfoSnippet icon="music_note" subText="Monthly listeners">{parseNumber(monthlyListeners)}</InfoSnippet>
          <InfoSnippet icon="fingerprint" subText="Genre">{genre}</InfoSnippet>
          <InfoSnippet
            icon="settings_input_component"
            subText="Technical requirements"
          >
            <div style={{display: "flex"}}>
              {technicalRequirements.map(technicalRequirement => <Chip style={{margin: "0 .5em .5em 0"}} key={technicalRequirement}>{technicalRequirement}</Chip>)}
            </div>
          </InfoSnippet>
        </List>
        <InfoSnippet
          icon="history"
          orientation="portrait"
          disableTitle
          disableHover
          alignSubText="center"
          subText="Previous concerts"
        >
          <Table>
            <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn>Concert date</TableHeaderColumn>
                <TableHeaderColumn>Tickets sold</TableHeaderColumn>
                <TableHeaderColumn>Total income</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} showRowHover>
              {concerts &&
                Object.keys(band.concerts).map(key => {
                  const concert = concerts[band.concerts[key]]
                  if (concert) {
                    const {from, participants, ticketPrice} = concert
                    return (
                      <TableRow key={key}>
                        <TableRowColumn>{parseDate(from)}</TableRowColumn>
                        <TableRowColumn>{parseNumber(participants)}</TableRowColumn>
                        <TableRowColumn>{parsePrice(participants*ticketPrice)}</TableRowColumn>
                      </TableRow>
                    )
                  } else return null

                })
              }
            </TableBody>
          </Table>
        </InfoSnippet>
      </CardText>
    </Card>
  )
}
