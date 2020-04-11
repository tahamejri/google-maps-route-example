import React from 'react';
import MapContainer from './components/map';
import './App.css';


//this array contains what we can call a path or somethin like that,
// ech element of it contains a startLocation and an end Location
let orders = [
  {
    startLocation:{
  lat:36.133916,
  lng:10.381719
},endLocation:{
  lat:34.728168, 
  lng:10.757327
}
},
{
  startLocation:{
lat:36.133916,
lng:10.381719
},
endLocation:{
lat:36.732329,  
lng:10.221794,
}
}
]

function App() {
  return (
    <div className="App">
      <MapContainer orders = {orders}/>
    </div>
  );
}

export default App;
