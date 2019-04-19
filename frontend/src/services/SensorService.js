const serverURL = 'http://localhost:9000';
//console.log("%%% SensorService.js was called. %%%");

export const getSensors = () => {
  //console.log("--- getSensors() was called. ---")
  return fetch(`${serverURL}/sensors`)
    .then(res => {
      if(res.status !== 200) {
        throw new Error('Error fetching sensors');
      }
      return res.json();
    });
}




