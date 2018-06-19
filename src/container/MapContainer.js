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

  onReadyCallback({loadedModules: [Map, MapView, Graphic, BasemapToggle, Color, PictureMarkerSymbol], containerNode}){

      // console.log("this.state.allCountryCoords", this.state.allCountryCoords)

      const theMap = new Map({
        basemap: 'oceans'
      });

      const mapView = new MapView({
        container: containerNode,
        center: [-3.2, 55.5],
        zoom: 4,
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
            type: "picture-marker",
            url: "http://static.arcgis.com/images/Symbols/Basic/WhiteFlag.png",
            width: 15,
            height: 15
            // color: new Color ("#2454a0"),
            // outline: {
            //   color: [255, 255, 255],
            //   width: 2
            // }
          },
          attributes: {
            Country: country.name,
            Region: country.region,
            Population: country.population
          },
          popupTemplate: {
            title: "{Country}",
            content: [
              {
                type: "fields",
                fieldInfos: [
                  {fieldName: "Country"}, {fieldName: "Region"}, {fieldName: "Population"}
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
          modulesToLoad={['esri/Map', 'esri/views/MapView', 'esri/Graphic', 'esri/widgets/BasemapToggle', 'esri/Color']}
          onReady={this.onReadyCallback}
        />
      )
    }

    return (
      <div className ="App">
        <h3>Countries of the World</h3>
        {componentToRender}
      </div>
    );
  }
}


export default MapContainer;
