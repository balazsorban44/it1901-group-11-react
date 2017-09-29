import React, { Component } from 'react'
import firebase from 'firebase'
import Paper from 'material-ui/Paper';
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';

export default class Search extends Component{
  constructor(props) {
     super(props);
     this.state = {
       value: 1,
       bands:{},
       input:"",
       bandsToOutput : [],
       selectedBand: "",
       genres:["none", "All Genres", "Pop", "Rock", "Electric", "Rap", "RnB"]
     };
   }
   componentDidMount(){
     const db = firebase.database().ref()
     const bandsRef = db.child('bands')
     bandsRef.on('value', snap =>{
       const bands = snap.val()
       this.setState({bands})
     })
   }

   doSearch(input, directValue){
     let {bands, genres, value} = this.state

     //HACK to get updated value when changing genre. State did not change fast enough 
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

  onClickedBand(band){this.setState({selectedBand:band})}

   render(){
     return(
       <Paper className = "BookingManagerMakeOfferBox">
         <h1>Search</h1>
         <TextField hintText="Search for band" onChange = {input => this.doSearch(input.target.value)}/><br/>

         <SelectField
         floatingLabelText="Genre"
         value={this.state.value}
         onChange={this.handleChange}
         autoWidth={true}
       >
         <MenuItem value={1} primaryText="All genres" />
         <MenuItem value={2} primaryText="Pop" />
         <MenuItem value={3} primaryText="Rock" />
         <MenuItem value={4} primaryText="Electric" />
         <MenuItem value={5} primaryText="Rap" />
         <MenuItem value={6} primaryText="RnB" />
       </SelectField>
       <div>
            <BandInfo bands = {this.state.bands} band = {this.state.selectedBand}/>
       </div>
       <div>
        <h5>Search results:</h5>
         {Object.keys(this.state.bandsToOutput).map(memberKey => {
           return(
             <p onClick = {input => this.onClickedBand(this.state.bands[this.state.bandsToOutput[memberKey]])} key={memberKey}>{this.state.bands[this.state.bandsToOutput[memberKey]].name}</p>
           )
         })}
       </div>
       </Paper>
     )
   }
}

//Info about band after band is clicked
const BandInfo = ({bands, band}) =>{
  if(band === ""){
    return(
      <div></div>
    )
  }else{
    return(
      <div>
        <h5>{band.name}</h5>
        <p>Sales: {band.albumSales}</p>
        <p>Monthly listeners: {band.monthlyListeners}</p>
      </div>
    )
  }

}
