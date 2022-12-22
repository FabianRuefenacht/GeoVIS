/*----------Imports----------*/
import React, { Component } from 'react';
import Button from '@mui/material/Button';
import Airports from './data/Airports.json';
import L from "leaflet";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet'
import "./App.css";
import "leaflet/dist/leaflet.css";
import { Checkbox, Grid, FormControlLabel, FormGroup, Typography} from '@mui/material';
import axios from "axios";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import Plane_Icon from "./data/Plane_icon.png";
/*----------Marker-Icon----------*/
var myIcon = L.icon({
  iconUrl: require('./data/Plane_icon.png'),
  iconSize: [20, 20],
  iconAnchor: [20, 20],
  popupAnchor: [-3, -76],
  shadowSize: [68, 95],
  shadowAnchor: [22, 94]
});
/*----------Definitions----------*/
class MyMap extends Component {
  constructor(props) {
    super(props);
    this.state = {slat:null,
                  slon:null,
                  siata: null,
                  elat:null,
                  elon:null,
                  eiata: null,
                  renderStart: false,
                  renderEnd: false,
                  line: null,
                  renderLine: false,
                  renderAirports: true,
                  showMenu: false,
                  Help: true,
                  About: false,
                  AboutLine: false,
                  AboutCalc: false,
                  AboutItem: false,
                  AboutUs: false
                };
  }
/*----------Render-Function----------*/
  render() {
    return (
      <div className='ADMIN-DIV'>
        {/*----------Heading Bar----------*/}
        <AppBar position='sticky'>
          <Toolbar>
            <Grid container justifyContent={'flex-start'}>
              <Grid item xs={12}>
                <Typography fontSize={30}>Geodesic Line Caluculator</Typography>
              </Grid>
              <Grid>
                <Typography fontSize={17} color={'#1976D2'}>.</Typography></Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        {/*----------Base-Map----------*/}
        <MapContainer center={[47.5349, 7.6416]}
                      zoom={6}
                      scrollWheelZoom={true}
                      maxBounds={[[-90,-180],[90,180]]}>
          {/*----------Content Base Map----------*/}
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  noWrap='true'
                  minZoom='4'
                  worldCopyJump='true'
                  />
          {/*----------Adding all airports to the map----------*/}
          {this.state.renderAirports &&<>
          {Airports.map(Airports => (
            <Marker
            key={Airports.fields.iata}
            position={[Airports.fields.geo_point_2d[0],Airports.fields.geo_point_2d[1]]}
            icon={myIcon}>
              <Popup position={[Airports.fields.geo_point_2d[0],Airports.fields.geo_point_2d[1]]} minWidth={300}>
                <div>
                  <div>
                    <h2>{Airports.fields.name_en}</h2>
                    iata: {Airports.fields.iata}<br/>
                    Country: {Airports.fields.country}<br/>
                    Website: <a href={Airports.fields.website} target="_blank" rel='noreferrer'>
                      {Airports.fields.website}
                    </a>
                    <br/>
                    <br/>
                    <Grid container>
                      <Grid>
                        <h3 style={{marginBottom:25}}>Select as:</h3>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item xs={5}style={{marginLeft:7, marginRight:17}}>
                        {/*----------Define starting-point----------*/}
                        <Button variant='contained' onClick={() => {this.setState({slat:`${Airports.fields.geo_point_2d[0]}`});
                                                                    this.setState({slon:`${Airports.fields.geo_point_2d[1]}`});
                                                                    this.setState({siata: `${Airports.fields.iata}`});
                                                                    this.setState({renderStart: true});}}>
                          Departure
                        </Button>
                      </Grid>
                      <Grid item xs={5}style={{marginLeft:17}}>
                        {/*----------Define end-point----------*/}
                        <Button variant='contained' onClick={() => {this.setState({elat:`${Airports.fields.geo_point_2d[0]}`});
                                                                    this.setState({elon:`${Airports.fields.geo_point_2d[1]}`});
                                                                    this.setState({eiata: `${Airports.fields.iata}`});
                                                                    this.setState({renderEnd: true});}}>
                          Destination
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </Popup>
            </Marker>
          ) )}</>
          }
          {/*----------show geodesic line----------*/}
          {this.state.renderLine &&<>
            <GeoJSON data={this.state.line} style={{ weight: 2, opacity: '100%', color: 'blue'}}/>
          </>}
        </MapContainer>
        {/*----------Display starting point----------*/}
        {this.state.renderStart &&
        <div className='renderStart'>
          <h2>Coordinates of Departure:</h2>
          <h4 style={{marginBottom:-10}}>IATA-Code: {this.state.siata}</h4>
          <p>Coordinates: {this.state.slat} / {this.state.slon}</p>
        </div>
        }
        {/*----------Display end point----------*/}
        {this.state.renderEnd &&
        <div className='renderEnd'>
          <h2>Coordinates of Destination:</h2>
          <h4 style={{marginBottom:-10}}>IATA-Code: {this.state.eiata}</h4>
          <p>Coordinates: {this.state.elat} / {this.state.elon}</p>
        </div>
        }
        {/*----------Display operation-buttons----------*/}
        {this.state.renderStart && this.state.renderEnd &&
        <div className='operationButtons'>
          <Button variant='contained' onClick={() => {var url = `https://vm26.sourcelab.ch/geodetic/&?slat=${this.state.slat}&slng=${this.state.slon}&elat=${this.state.elat}&elng=${this.state.elon}`;
                                                      this.setState({renderLine: false})
                                                      axios
                                                        .get(url)
                                                        .then((response) => {
                                                          this.setState({line: response.data, renderLine: true});
                                                        })
          }}>calculate</Button>
          <Button variant='contained' color='error' onClick={() => {this.setState({Line: null,
                                                                                   slat:null,
                                                                                   slon:null,
                                                                                   elat:null,
                                                                                   elon:null,
                                                                                   line:null,
                                                                                   renderEnd:false,
                                                                                   renderStart:false,
                                                                                   renderLine: false})}}>
              Reset
            </Button>
        </div>
        }
        {/*----------Display Menu hidden----------*/}
        {!this.state.showMenu &&
          <div className='Menu'
             onClick={() => {this.setState({showMenu: !this.state.showMenu});}}>
            <div className='Arrow'></div>
          </div>
        }
        {/*----------Display Menu----------*/}
        {this.state.showMenu && <>
        <div className='hideMenu'
              onClick={() => {this.setState({showMenu: !this.state.showMenu});}}>
          <div className='hideArrow'></div>
        </div>
        <div className='MenuItems'>
          {/*----------toggle layers----------*/}
          <aside className='Layers'>
            <h3 className='Layername'>Layers</h3>
            <Grid container>
              <Grid>
                <FormGroup>
                  <FormControlLabel className='LayerAirports' control={<Checkbox checked={this.state.renderAirports}/>} label="Airports" onClick={() => {
                    this.setState({renderAirports: !this.state.renderAirports})
                  }}/>
                  <FormControlLabel className='LayerLine' control={<Checkbox checked={this.state.renderLine}/>} label="geodesic line" onClick={() => {
                    this.setState({renderLine: !this.state.renderLine})
                  }}/>
                </FormGroup>
              </Grid>
            </Grid>
          </aside>
          <aside className='Info'>
            {/*----------Display of Help----------*/}
            <div className='Help'
                 onClick={() => {this.setState({Help: true})
                                 this.setState({About: false})}}>
              <h3>
                Help
              </h3>
            </div>
            {/*----------toggle Help----------*/}
            {this.state.Help &&
                <div className='helpContent'>
                  <h4 className='HelpInstructions'>
                    1. Click on Airplane-Icon:&nbsp;&nbsp;
                    <img src={Plane_Icon}
                        alt='Plane Icon'
                        width="20"
                        height="20"
                        translate={'-15px'}
                        className='PlaneIcon'/>
                    <br/>
                    2. Select the airport as either the departure &nbsp;&nbsp;&nbsp;&nbsp;point
                    or the destination point by pressing &nbsp;&nbsp;&nbsp;&nbsp;the corresponding button.
                    <br/>
                    3. Once the departure and destination points &nbsp;&nbsp;&nbsp;&nbsp;have been defined, the CALCULATE and
                    &nbsp;&nbsp;&nbsp;&nbsp;RESET buttons will appear.<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;a.&nbsp;&nbsp;CALCULATE displays the geodesic line
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;between the departure and destination
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;points.<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;b.&nbsp;&nbsp;With RESET, the departure point,
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;destination point and the geodesic line
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;are deleted.
                    <br/>
                    4. In the "Layer" menu (to the left of this
                    &nbsp;&nbsp;&nbsp;&nbsp;text), the airports and the geodesic line can
                    &nbsp;&nbsp;&nbsp;&nbsp;be hidden and shown again.
                  </h4>
                </div>}
            {/*----------Display of About----------*/}
            <div className='About'
                 onClick={() => {this.setState({About: true})
                                 this.setState({Help: false})}}>
              <h3>
                About
              </h3>
            </div>
            {/*----------toggle About----------*/}
            {this.state.About &&
                <div className='aboutContent'>
                  <h3 className='AboutItem' 
                      onClick={() => {this.setState({AboutLine: !this.state.AboutLine})}}>
                    What is a geodesic line?
                  </h3>
                  {this.state.AboutLine &&
                  <p>
                    A geodesic line, also known as a geodetic line or a great circle,
                    is a line on the earth's surface that follows the shortest distance
                    between two points, taking into account the earth's curvature.<br/>
                    Geodesic lines are used in geodetic survey work, which is the process
                    of determining the precise position of points on the earth's surface.
                    This information is used to create maps, measure land boundaries, and
                    establish the location of landmarks and other points of reference.<br/>
                    Geodesic lines are different from straight lines or great ellipses,
                    which are often used in cartography and other fields to represent
                    the shortest distance between two points on a flat surface. Geodesic
                    lines take into account the fact that the earth is not a flat surface,
                    but rather a sphere with a slightly flattened shape. As a result, geodesic
                    lines will often appear curved when they are plotted on a flat map.
                  </p>
                  }
                  <h3 className='AboutItem'
                      onClick={() => {this.setState({AboutCalc: !this.state.AboutCalc})}}>
                    How is the geodesic line calculated?
                  </h3>
                  {this.state.AboutCalc &&
                  <>
                  <p>
                    The geodesic line is calculated with the Python library pyproj. Details at:
                  </p>
                  <a href="https://pyproj4.github.io/pyproj/stable/" target="_blank" rel='noreferrer'>
                    https://pyproj4.github.io/pyproj/stable/
                  </a>
                  </>
                  }
                  <h3 className='AboutItem'
                      onClick={() => {this.setState({AboutData: !this.state.AboutData})}}>
                    Reliability of airport data:
                  </h3>
                  {this.state.AboutData &&
                  <>
                  <p>
                    The data of the airports were taken from openstreetmap. Therefore, no statement can be made about the accuracy and completeness of the data. The GeoJSON of the airports can be found here:
                  </p>
                  <a href='https://data.opendatasoft.com/explore/dataset/osm-world-airports@babel/export/' target="_blank" rel='noreferrer'>
                    https://data.opendatasoft.com/explore/dataset/osm-world-airports@babel/export/
                  </a>
                  </>}
                  <h3 className='AboutItem'
                      onClick={() => {this.setState({AboutUs: !this.state.AboutUs})}}>
                    Creators
                  </h3>{this.state.AboutUs &&
                  <>
                  <a style={{paddingtop:0}} href = "mailto: fredrik.lennstroem@students.fhnw.ch">Fredrik Lennström</a><br/>
                  <a style={{paddingtop:0}} href = "mailto: fabian.ruefenacht@students.fhnw.ch">Fabian Rüfenacht</a><br/>
                  <a style={{paddingtop:0}} href = "mailto: philipp.studer2@students.fhnw.ch">Philipp Studer</a>
                  </>}
                </div>}
          </aside>
        </div>
        </>
        }
      </div>
    )
  }
}

export default MyMap;