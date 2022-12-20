import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { MapContainer, TileLayer, GeoJSON, Map, Marker, Popup } from 'react-leaflet'
import axios from "axios";
import geoJSON from './data.json';
import Geovis from "./Geovis";

import 'leaflet/dist/leaflet.css';

function App() {
  return (<>
    <div>TEST</div>
    <Geovis></Geovis>
    </>
       
  );
}

export default App;
