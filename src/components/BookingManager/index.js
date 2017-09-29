import React, { Component } from 'react'
import firebase from 'firebase'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import {Tabs, Tab} from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';


export default class BookingManager extends Component {
  constructor() {
    super()
    this.state = {
      bands:{},
      // initializing local concerts
      openedMenuItem: "search"
    }
  }

// Fetching content from firebase
componentDidMount(){
  const db = firebase.database().ref()
  const bandsRef = db.child('bands')
  const bands = {}

  bandsRef.on('value', snap =>{
    const bands = snap.val()
    this.setState({bands})
  })


  // referencing database (firebase) "ready up for connect"
  // const db = firebase.database().ref()
  // accesing child of database = concerts

}

handleMenuItemClick(openedMenuItem){
  this.props.toggleDrawer()
  this.setState({openedMenuItem})
}

  render() {
    const {isDrawerOpened} = this.props
    const {openedMenuItem} = this.state
    const bands = this.state.band
    return (
        <div>
          <Drawer open={isDrawerOpened}>
            <MenuItem onClick={() => this.handleMenuItemClick("newBooking")} primaryText="New booking" />
            <MenuItem onClick={() => this.handleMenuItemClick("previousConcerts")} primaryText="Previous concerts" />
            <MenuItem onClick={() => this.handleMenuItemClick("search")} primaryText="Search" />
          </Drawer>

          {{
            "newBooking":
            <MakeOffer/>,
            "previousConcerts":
            <PreviousConcerts/>,
            "search":
            <Search{...{bands}}/>
          }[openedMenuItem]}

        </div>
    )}
}



const MakeOffer = () =>
      <Paper className = "BookingManagerMakeOfferBox">
        <h1> Make offer</h1>
        <TextField hintText="Band"/><br/>
        <TextField hintText="Price"/><br/>
        <DatePicker hintText="Date" />
        <TextField
          hintText="Message Field"
          floatingLabelText="Message"
          multiLine={true}
          rows={6}
        />
      </Paper>


class Search extends Component{
  constructor(props) {
     super(props);
     this.state = {
       value: 1,
       bands:{},
       input:"",
       bandsToOutput : [],
       genres:["none", "All Genres", "Pop", "Rock", "Electric", "Rap", "RnB"]
     };
     this.loadDb()
   }


   loadDb = () =>{
     const db = firebase.database().ref()
     const bandsRef = db.child('bands')
     const bands = {}
     bandsRef.on('value', snap =>{
       const bands = snap.val()
       this.setState({bands})
     })
   }

   doSearch = (input) =>{
     this.setState({input:input})
     const bands = this.state.bands
     let bandsToOutput = []
     Object.keys(bands).forEach(key =>{
        let str = String(bands[key].name).toLowerCase()
        if((str.includes(input.toLowerCase()) &&(this.state.genres[this.state.value] == bands[key].genre || this.state.value == 1))){
          bandsToOutput.push(key)
        }
      })
      this.setState({bandsToOutput:bandsToOutput})
      console.log("did searhc")
   }

   handleChange = (event, index, value) =>{
      this.setState({value:value})
    }

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
       <h5>Search results:</h5>
         {Object.keys(this.state.bandsToOutput).map(memberKey => {
           return(
             <p key={memberKey}>{this.state.bands[this.state.bandsToOutput[memberKey]].name}</p>
           )
         })}
       </div>
       </Paper>
     )
   }
}







//Might not be used
  const styles = {
      headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
          ontWeight: 400,
      },
      slide: {
        padding: 10,
      },
    };

class PreviousConcerts extends Component {

constructor(props) {
   super(props);
   this.state = {
     slideIndex: 0,
   };
 }

 handleChange = (value) => {
   this.setState({
     slideIndex: value,
   });
 };

 render() {
   return (

     <div>
       <Tabs
         onChange={this.handleChange}
         value={this.state.slideIndex}
       >
         <Tab label="Rock" value={0} />
         <Tab label="Pop" value={1} />
         <Tab label="Hip-Hop" value={2} />
         <Tab label="Country" value={3} />
       </Tabs>
       <SwipeableViews
         index={this.state.slideIndex}
         onChangeIndex={this.handleChange}
       >
         <div>
           <h2 style={styles.headline}>Tabs with slide effect</h2>
           Swipe to see the next slide.<br />
         </div>
         <div style={styles.slide}>
           slide n°2
         </div>
         <div style={styles.slide}>
           slide n°3
         </div>
       </SwipeableViews>
     </div>

   )
 }
}
