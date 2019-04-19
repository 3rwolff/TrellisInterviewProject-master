import React from 'react';
import './SensorList.css';

import { getSensors } from '../../services/SensorService';
const serverURL = 'http://localhost:9000';

//console.log("%%% SensorList.js was called. %%%");
class SensorList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sensors: [],
      loading: true,
      error: '',
    };
  }

//function to retreive or close specific sensor details
sensorDetails(id) {
  //first close all open sensor details except the selecte one
  var ids = document.querySelectorAll( "[id^=sensorDetails]" );
  for (var i = 0; i < ids.length; i++){
    if ( i !== id - 1 )
      document.getElementById( ids[i].id ).innerHTML = "";
  }  

  //query for selected sensor's details
  if ( document.getElementById( "sensorDetails_" + id ).innerHTML === "" ){
    //update button text
     var buttons = document.querySelectorAll( "[id^=btn_details_]" );
     for (var j = 0; j < buttons.length; j++){
      buttons[j].innerHTML = "Open Details";
     }
    //update button text for selected sensor
    document.getElementById( "btn_details_" + id ).innerHTML = "Close Details";

    //fetch data from server
    fetch(`${serverURL}/selectedSensor?id=${id}`)
     .then(res => res.json())
     .then(data => {

      //loop through notes
      var notesList = `
            <div>
              <div id="btn_add" class="buttonClass" onClick="addNote();">Add Note</div>
            </div><br/>`;
      for( var i = 0; i < data.notes.length; i++ ){
        if( i !== 0 )
          notesList += '<br/>';
        notesList += `
          <div class="sensorNote"> 
            <b>Note Date: </b><span class="sensorData">${data.notes[i].date}</span>
            <span class="buttonClass btnDelete">&#10006</span>
            <hr/>
            <div class="sensorData">${data.notes[i].note_body}</div>
          </div>`;
      }//end for

      //format rest of data for return
      var formattedData = `
          <div class="sensorInfo"> 
            <b>ID</b>:<span class="sensorData"> ${data.id} </span>
            <br/><b>Name:</b><span class="sensorData"> ${data.name} </span>
            <br/><b>Desc:</b><span class="sensorData"> ${data.description} </span>
            <br/><br/>${notesList}
          </div>`;

      document.getElementById("sensorDetails_" + id).innerHTML = formattedData; 

     });//end fetch
   }//end if
   else{
     //else close selected sensor's details if they are open
     document.getElementById( "sensorDetails_" + id ).innerHTML = "";
     //update button text
     document.getElementById( "btn_details_" + id ).innerHTML = "Open Details";
   }
}//end sensorDetails()

//function to add a note
addNote() {
  console.log("Add a Note");
  //fetch data from server
    fetch(`${serverURL}/addNote`)
     .then(res => res.json())
     .then(data => { console.log( data ) });
}//end addNote()


  componentDidMount() {
    getSensors()
      .then(sensors => this.setState({ sensors, loading: false }))
      .catch(err => {
        console.error(err);
        this.setState({ error: err.message, loading: false })
      });
  }

  render() {
    const { loading, sensors, error } = this.state;
    if(error) {
      return (
        <div className="SensorListError">
          {error}
        </div>
      );
    }
    if(loading) {
      return (
        <div className="SensorListLoading">
          Loading...
        </div>
      );
    }
    return (
      <div className="SensorList">
        {
          sensors.map(({ id, name, description }) => (
          
            <div key={id} className="SensorListItem">
                <div className="SensorListName">{name}</div>
                <div className="SensorListDescription">{description}</div> 

                <div id="btn_add" className="buttonClass" onClick={(e) => this.addNote('test')}>\+\+\+</div>

                <div  className="sensorDetails">
                  <div id={"btn_details_" + id} className="buttonClass" onClick={(e) => this.sensorDetails(id)}>Open Details</div> 
                  <div id={"sensorDetails_" + id}></div>
                </div>
            </div>
    
          ))
        }
      </div>
    );
  }
}

export default SensorList;
