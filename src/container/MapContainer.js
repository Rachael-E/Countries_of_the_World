import React, { PureComponent } from 'react';
import EsriLoaderReact from 'esri-loader-react';

class MapContainer extends PureComponent {

  constructor(props){
    super(props)
    this.state = {
      testCoords: null,
      countries: [],
      currentCountry: null
    };
    // this.state = {map: null}
  }

  componentDidMount(){
    const url = 'https://restcountries.eu/rest/v2/all';
    fetch(url)
      .then(res => res.json())
      .then( (countriesData) => {

          const allCountriesLatLng = countriesData.map((country) => {
            return country.latlng.reverse()
          });

          this.setState({
            countries: countriesData,
            testCoords: allCountriesLatLng
          })
        })
      // .then(countriesData => console.log(countriesData))
      .catch(error => console.log("Error:", error))
      // console.log(this.state.countries)
  }

  render() {

    const options = {
      url: 'https://js.arcgis.com/4.7/'
    };

    const onReadyCallback = ({loadedModules: [Map, MapView, Graphic, BasemapToggle], containerNode}) => {
    // this.setState({

      console.log("this.state.testCoords", this.state.testCoords)

      const theMap = new Map({
        basemap: 'oceans'
      });

      const mapView = new MapView({
        container: containerNode,
        center: [-3.2, 55.5],
        zoom: 6,
        map: theMap
      });

      // const polyline = {
      //   type: "polyline",
      //   paths: this.state.testCoords
      // };

      const pointAtt = {
        LocalityName: "Place Holder For Name",
        LocalityDescription: "Place Holder for Description",
        DataHeld: "Links to data:"
      };

      // const countryLat = this.state.countries[1].latlng[0];
      // const countryLng = this.state.countries[1].latlng[1];
      // const countryLngLat = [countryLng, countryLat];
      // console.log(countryLngLat);

      const multiPoints = {
        type: "multipoint",
        points: this.state.testCoords
      };

      const markerSymbol = {
        type: "simple-marker",
        color: [226, 119, 40],
        outline: {
          color: [255, 255, 255],
          width: 2
        }
      };

      const pointGraphic = new Graphic({
        geometry: multiPoints,
        symbol: markerSymbol,
        attributes: pointAtt,
        popupTemplate: {
          title: "{LocalityName}",
          content: [{
            type: "fields",
            fieldInfos: [{
              fieldName: "LocalityName"
            }, {
              fieldName: "LocalityDescription"
            }, {
              fieldName: "DataHeld"
            }]
          }]
        }
      });
      mapView.graphics.addMany([pointGraphic]);

      const toggle = new BasemapToggle({
        view: mapView,
        nextBasemap: "satellite"
      });
      mapView.ui.add(toggle, "top-right");
    }

    if ( !this.state.testCoords ) {
      var componentToRender = (
        <p>Loading data ....</p>
      )
    } else {
        var componentToRender = (
            <EsriLoaderReact
              options={options}
              modulesToLoad={['esri/Map', 'esri/views/MapView', 'esri/Graphic', 'esri/widgets/BasemapToggle']}
              onReady={onReadyCallback}
            />
          )
    }

    return (
      <div className ="App">
        {componentToRender}
      </div>
    );
  }
}

export default MapContainer;
