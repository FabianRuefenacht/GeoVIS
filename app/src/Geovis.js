import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { MapContainer, TileLayer, GeoJSON, Map, Marker, Popup } from 'react-leaflet'
import axios from "axios";
import geoJSON from './data.json';
import TextField from "@mui/material/TextField";

import 'leaflet/dist/leaflet.css';

class Geovis extends React.Component {
  constructor(props) {
      super(props);

      this.state={start:2, end:1, render: false};
      this.setStartpunkt=this.setStartpunkt.bind(this);
      this.setEndpunkt=this.setEndpunkt.bind(this);


  }

  setStartpunkt(event) {
    this.setState({start: event.target.value});
  }
  setEndpunkt(event) {
    this.setState({end: event.target.value});
  }

  render() {
      return (
          <><TextField value={this.state.start} label="Startpunkt"></TextField>
          <TextField value={this.state.end} label="Endpunkt"></TextField>
              <MapContainer value={this.state.end} onClick={this.setStartpunkt} center={[47.5349, 7.6416]} zoom={2} scrollWheelZoom={true}
              style={{ height: "1000px", width: "100%" }} >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              {geoJSON.features.map(feature => (
                <Marker position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}>
                  <Popup>{feature.properties.name}<br/>
                  Koordinaten:{feature.properties.longitude}, {feature.properties.latitude}, {feature.properties['elevation [m]']}m.ü.M<br/>
                  Website: <a href={feature.properties.website} target="_blank" rel="noopener noreferrer">{feature.properties.website}</a><br/>
                  <Button value={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]} onClick={this.setStartpunkt}>Als Startpunkt auswählen</Button>
                  <Button value={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]} onClick={this.setEndpunkt}>Als Zielpunkt auswählen</Button>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

          </>
      )
  }

}

export default Geovis;
