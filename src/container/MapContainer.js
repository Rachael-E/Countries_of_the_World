import React, { PureComponent } from 'react';
import EsriLoaderReact from 'esri-loader-react';

class MapContainer extends PureComponent {

  constructor(props){
    super(props)
    this.state = {
      allCountryCoords: null,
      countries: [],
      currentCountry: null
    };
    // this.state = {map: null}
    this.onReadyCallback = this.onReadyCallback.bind(this);
  }

  componentDidMount(){
    const url = 'https://restcountries.eu/rest/v2/all';
    fetch(url)
    .then(res => res.json())
    .then( (countriesData) => {

      const allCountriesLatLng = countriesData.map((country, index) => {
        return country.latlng.reverse()
      });

      this.setState({
        countries: countriesData,
        allCountryCoords: allCountriesLatLng
      })
    })
    // .then(countriesData => console.log(countriesData))
    .catch(error => console.log("Error:", error))
  }

  onReadyCallback({loadedModules: [Map, MapView, Graphic, BasemapToggle], containerNode}){

      console.log("this.state.allCountryCoords", this.state.allCountryCoords)

      const theMap = new Map({
        basemap: 'oceans'
      });

      const mapView = new MapView({
        container: containerNode,
        center: [-3.2, 55.5],
        zoom: 6,
        map: theMap
      });


      const uniqueCountryMarkers = this.state.countries.map((country) => {

        return new Graphic({
          geometry: {
            type: 'point',
            longitude: country.latlng[0],
            latitude: country.latlng[1]
          },
          symbol: {
            type: "simple-marker",
            color: [226, 119, 40],
            outline: {
              color: [255, 255, 255],
              width: 2
            }
          },
          attributes: {
            LocalityName: country.name,
            LocalityDescription: country.region,
            DataHeld: "Links to data:"
          },
          popupTemplate: {
            title: "{LocalityName}",
            content: [
              {
                type: "fields",
                fieldInfos: [
                  {fieldName: "LocalityName"}, {fieldName: "LocalityDescription"}, {fieldName: "DataHeld"}
                ]
              }
            ]
          }
        })
      })


      mapView.graphics.addMany(uniqueCountryMarkers);

      const toggle = new BasemapToggle({
        view: mapView,
        nextBasemap: "satellite"
      });
      mapView.ui.add(toggle, "top-right");

    }


  render() {

    const options = {
      url: 'https://js.arcgis.com/4.7/'
    };

    if ( !this.state.allCountryCoords ) {
      var componentToRender = (
        <p>Loading data ....</p>
      )
    } else {
      var componentToRender = (
        <EsriLoaderReact
          options={options}
          modulesToLoad={['esri/Map', 'esri/views/MapView', 'esri/Graphic', 'esri/widgets/BasemapToggle']}
          onReady={this.onReadyCallback}
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
