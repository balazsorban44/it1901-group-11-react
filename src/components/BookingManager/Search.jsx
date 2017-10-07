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

import {parseDate, Loading, NoResult} from '../../utils'


export default class Search extends Component{
  constructor(props) {
    super(props)
    this.state = {
      input: "",
      genre: "All genres",
      bands: null,
      concerts: null,
      bandsToOutput : null,
      genres: ["All genres", "Pop", "Rock", "Electric", "Rap", "RnB"]
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
    let {bands, genres, genre, input} = this.state
    let bandsToOutput = Object.keys(bands).map(band => band)

    if (input !== "") {
      bandsToOutput = bandsToOutput.filter(bandKey => bands[bandKey].name.toLowerCase().includes(input))
    }

    if (genre !== genres[0]){
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
             <Icon name="search"/>
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
