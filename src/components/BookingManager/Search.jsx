import React, { Component } from 'react'
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField'
import {Icon} from '../../utils'
import SelectField from 'material-ui/SelectField'
import {Card, CardHeader, CardText} from 'material-ui/Card'
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar'

import { Table, TableBody, TableHeader,
  TableHeaderColumn, TableRow,
  TableRowColumn
} from 'material-ui/Table'

import {parseDate, Loading} from '../../utils'


export default class Search extends Component{
  constructor(props) {
    super(props)
    this.state = {
      value: 0,
      bands: this.props.bands,
      input: "",
      concerts: this.props.concerts,
      bandsToOutput : [],
      genres: ["none", "All Genres", "Pop", "Rock", "Electric", "Rap", "RnB"]
    }
  }

  componentWillReceiveProps({bands, concerts}) {
    let bandsToOutput = Object.keys(bands).map(band => band)
    this.setState({bands, bandsToOutput, concerts})
  }


  //Search for band containing strings in input and update bandsToOutput state
  searchForBand = (e, genre) => {
    let {bands, genres, value, input} = this.state
    if(e !== null){
      input = e
    }
    if(typeof invalue !== "undefined"){
      value = genre
    }

    let bandsToOutput = Object.keys(bands).map(band => band)
    if(genres[value] !== "All Genres"){
      console.log(genres[value])
      //bandsToOutput = bandsToOutput.filter(bandKey => genres[value] === bands[bandKey].genre)
    }
    if (input !== "") {
      bandsToOutput = bandsToOutput.filter(bandKey => bands[bandKey].name.toLowerCase().includes(input))
    }
    this.setState({bandsToOutput})
  }

  handleInputChange = e => {
      const input = e.target.value.toLowerCase()
      this.setState({input})
      this.searchForBand(input, null)

  }

  //onChange genre dropdown list
  handleGenreChange = (event, index, value) => {
    this.setState({value})
    this.searchForBand(null, value)
  }

   render(){
     const {value, bandsToOutput, bands, concerts} = this.state
     return(
       <div>
         <Toolbar>
           <ToolbarGroup>
             <TextField  fullWidth hintText="Search for band" onChange={this.handleInputChange}/>
             <Icon name="search"/>
           </ToolbarGroup>
           <ToolbarGroup>
             <SelectField value={value} onChange={this.handleGenreChange} autoWidth>
               <MenuItem value={0} primaryText="All genres" />
               <MenuItem value={1} primaryText="Pop" />
               <MenuItem value={2} primaryText="Rock" />
               <MenuItem value={3} primaryText="Electric" />
               <MenuItem value={4} primaryText="Rap" />
               <MenuItem value={5} primaryText="RnB" />
             </SelectField>
           </ToolbarGroup>
         </Toolbar>
         <div className="search">
           { bands && bandsToOutput.length > 0 ?
             bandsToOutput.map(key => (<BandSearchResult key={key} concerts={concerts} band={bands[key]}/>)) :
             <Loading/>
           }
         </div>
       </div>
     )}
 }

//Card for every band in search results
const BandSearchResult = ({band, concerts}) => {
const {name, genre, albumSales, monthlyListeners} = band
  return (
    <Card className="search-result">
      <CardHeader title={name} subtitle={genre} actAsExpander showExpandableButton/>
      <CardText expandable>
        <h6><Icon name="album"/> Album sales</h6>
        <p>{albumSales}</p>
        <h6><Icon name="music_note"/> Monthly listeners</h6>
        <p>{monthlyListeners}</p>
        <h6><Icon name="history"/> Previous concerts</h6>
        <Table>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Concert date</TableHeaderColumn>
              <TableHeaderColumn>Tickets sold</TableHeaderColumn>
              <TableHeaderColumn>Total income (NOK)</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody showRowHover displayRowCheckbox={false}>
            {concerts &&
              Object.keys(band.concerts).map(key => {
                const concert = concerts[band.concerts[key]]
                if (concert) {
                  const {from, participants, ticketPrice} = concert
                  return (
                    <TableRow key={key}>
                      <TableRowColumn>{parseDate(from)}</TableRowColumn>
                      <TableRowColumn>{participants}</TableRowColumn>
                      <TableRowColumn>{participants*ticketPrice}</TableRowColumn>
                    </TableRow>
                  )
                } else return null

              })
            }
          </TableBody>
        </Table>
      </CardText>
    </Card>
  )
}
