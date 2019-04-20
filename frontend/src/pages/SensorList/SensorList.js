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


//function to start adding a note
addNote(id) {
  console.log("Add a Note");

  if(document.getElementById("btn_add_" + id).innerHTML === "Add Note"){
    //add note button pressed
    document.getElementById("txt_note_" + id).style.display = "block";
    document.getElementById("btn_save_" + id).style.display = "block";
    document.getElementById("btn_add_" + id).innerHTML = "Cancel";
  }
  else{
    //cancel button pressed
    document.getElementById("txt_note_" + id).style.display = "none";
    document.getElementById("btn_add_" + id).innerHTML = "Add Note";
    document.getElementById("btn_save_" + id).style.display = "none";
  }
}//end addNote()

//function to save a note
saveNote(id) {
  console.log("saveNote() was called" + id)
  //console.log(document.getElementById("txt_note_" + id).value);
  if(document.getElementById("txt_note_" + id).value === ""){
    //don't allow empty notes to be saved
    alert("Your note can't be empty.")
  }
  else{
    //send data to server
    var notebody = document.getElementById("txt_note_" + id).value;

    /*fetch(`${serverURL}/saveNote?id=${id}&notebody=${notebody}`)*/

    fetch(`${serverURL}/saveNote`, {
      method: 'POST',
      body: JSON.stringify({
        'id': id, 
        'notebody': notebody
      }),
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"}  
    });

   /* fetch(`${serverURL}/saveNote`)
     .then(res => res.json())
     .then(data => { console.log( data ) });*/
    }

}//end saveNote()

//function to retreive or close specific sensor details
sensorDetails(id) {
  //first close all open sensor details and notes and hide add buttons, except the selected one
  var ids = document.querySelectorAll( "[id^=sensorDetails]" );//sensor details
  var note_ids = document.querySelectorAll( "[id^=sensorNotes]" );//sensor notes
  var btn_add_ids = document.querySelectorAll( "[id^=btn_add_]" );//add note buttons
  var btn_save_ids = document.querySelectorAll( "[id^=btn_save_]" );//save buttons
  var txt_note_ids = document.querySelectorAll( "[id^=txt_note_]" );//add note textarea
  for (var i = 0; i < ids.length; i++){
    if ( i !== id - 1 ){
      document.getElementById( ids[i].id ).innerHTML = "";//clear open sensor details
      document.getElementById( note_ids[i].id ).innerHTML = "";//clear open notes
      document.getElementById( btn_add_ids[i].id ).style.display = "none";//hide add note buttons
      document.getElementById( btn_add_ids[i].id).innerHTML = "Add Note";//change button text
      document.getElementById( btn_save_ids[i].id ).style.display = "none";//hide save buttons
      document.getElementById( txt_note_ids[i].id ).style.display = "none";//hide textareas
    }
  }

  //query for selected sensor's details
  if ( document.getElementById( "sensorDetails_" + id ).innerHTML === "" ){
    //update button text
     var buttons = document.querySelectorAll( "[id^=btn_details_]" );
     for (var k = 0; k < buttons.length; k++){
      buttons[k].innerHTML = "Open Details";
     }
    //update button text for selected sensor
    document.getElementById( "btn_details_" + id ).innerHTML = "Close Details";

    //fetch data from server
    fetch(`${serverURL}/selectedSensor?id=${id}`)
     .then(res => res.json())
     .then(data => {

      //build add note button
      var notesList = "";
      //loop through notes
      for( var i = data.notes.length - 1; i >= 0; i-- ){
        console.log(i);
        notesList += `
          <div class="sensorContainer">
            <div class="sensorNote"> 
              <b>Note Date: </b><span class="sensorData">${data.notes[i].date}</span>
              <span class="buttonClass btnDelete">&#10006</span>
              <hr/>
              <div class="sensorData">${data.notes[i].note_body}</div>
            </div>
          </div>`;
      }//end for

      document.getElementById("sensorNotes_" + id).innerHTML = notesList;

      //show add note button and text area
      document.getElementById("btn_add_" + id).style.display = "block";

      //format rest of data for return
      var formattedData = `
          <div class="sensorInfo"> 
            <b>ID</b>:<span class="sensorData"> ${data.id} </span>
            <br/><b>Name:</b><span class="sensorData"> ${data.name} </span>
            <br/><b>Desc:</b><span class="sensorData"> ${data.description} </span>
          </div>`;

      document.getElementById("sensorDetails_" + id).innerHTML = formattedData; 

     });//end fetch
   }//end if
   else{
     //else close selected sensor's details and notes if they are open
     document.getElementById( "sensorDetails_" + id ).innerHTML = "";
     document.getElementById( "sensorNotes_" + id ).innerHTML = "";
     //hide add note button
     document.getElementById("btn_add_" + id ).style.display = "none";
     document.getElementById("txt_note_" + id ).style.display = "none";

     //update button text
     document.getElementById( "btn_details_" + id ).innerHTML = "Open Details";
   }
}//end sensorDetails()

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

                <div  className="sensorDetails">
                  <div id={"btn_details_" + id} className="buttonClass" onClick={(e) => this.sensorDetails(id)}>Open Details</div> 
                  <div id={"sensorDetails_" + id}></div>

                  <div id={"note_container_" + id}>
                    <div id={"btn_add_" + id} className="buttonClass btnAdd" onClick={(e) => this.addNote(id)}>Add Note</div>
                    <div id={"btn_save_" + id} className="buttonClass btnAdd" onClick={(e) => this.saveNote(id)}>Save</div>
                    <textarea id={"txt_note_" + id} name="txt_note" form="form_note" rows="3" cols="40" placeholder="Type your note here..."></textarea>
                  </div>

                  <div id={"sensorNotes_" + id}></div>
                </div>
            </div>
          ))
        }
      </div>
    );
  }
}

export default SensorList;
