import React, { Component } from "react";
import { compose, withProps } from "recompose";
import DirectionRenderComponent from "./route";
const { withScriptjs, withGoogleMap, GoogleMap ,Marker} = require("react-google-maps");


class MapContainer extends Component {
    constructor(props){
        super(props)
        this.state = {
            defaultZoom: 10,
            map: null,
            center:{ lat: 36, lng: 10.2160746 }
          };
    }

  render() {
    return (
      <GoogleMap
        defaultZoom={this.state.defaultZoom}
        center={this.state.center}
        defaultCenter={new window.google.maps.LatLng(this.state.lat, this.state.lng)}
        style = {{
            width: "100%",
            height: "79vh",
            "border-radius": ".625rem .625rem"
          }}
      >
        {this.props.orders.map(singorder => {
            return (
            <DirectionRenderComponent 
            routeColor = {singorder.status === "pending" ? "#FF0000" : "#32CD32"}
            order = {singorder}
            viewport = {true} />)
        })}
        
      </GoogleMap>
    );
  }
}

export default compose(
  withProps({
    googleMapURL: 'https://maps.googleapis.com/maps/api/js?key=[your map key]',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `90vh` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(MapContainer);
