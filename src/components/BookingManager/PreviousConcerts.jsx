import React, { Component } from 'react'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem'
import Paper from 'material-ui/Paper';


export default class PreviousConcerts extends Component{
  constructor(props) {
     super(props);
     this.state = {
       concerts: {},
       events : {},
     };
   }
   componentWillReceiveProps({concerts, events}) {
     this.setState({concerts, events})
   }

   componentDidMount(){

   }

   render(){
     return(
       <div>
        <Paper className = "defaultPaper">
        <h3>Previous concerts</h3>
        <SelectField floatingLabelText="Event" value={this.state.value} onChange={this.handleChange} autoWidth={true}>
           <MenuItem value={1} primaryText="Event 1" />
           <MenuItem value={2} primaryText="Event 2" />
           <MenuItem value={3} primaryText="Event 3" />
           <MenuItem value={4} primaryText="Event 4" />
           <MenuItem value={5} primaryText="Event 5" />
           <MenuItem value={6} primaryText="Event 6" />
        </SelectField>
        <SelectField floatingLabelText="Genre" value={this.state.value} onChange={this.handleChange} autoWidth={true}>
           <MenuItem value={1} primaryText="All genres" />
           <MenuItem value={2} primaryText="Pop" />
           <MenuItem value={3} primaryText="Rock" />
           <MenuItem value={4} primaryText="Electric" />
           <MenuItem value={5} primaryText="Rap" />
           <MenuItem value={6} primaryText="RnB" />
        </SelectField>
        </Paper>
       </div>
     )
   }

}
