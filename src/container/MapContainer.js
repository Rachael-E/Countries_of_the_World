import React, { PureComponent } from 'react';
import EsriLoaderReact from 'esri-loader-react';

class MapContainer extends PureComponent {

  constructor(props){
    super(props)
    this.state = {
      testCoords: [
        [-2.68, 55.97],
        [-3.94, 56.12],
        [-3.51, 56.00]
      ]
    };
    // this.state = {map: null}
  }

  render() {

    const options = {
      url: 'https://js.arcgis.com/4.7/'
    };

    return (
      <div className ="App">
        <EsriLoaderReact
          options={options}
          modulesToLoad={['esri/Map', 'esri/views/MapView', 'esri/Graphic', 'esri/widgets/BasemapToggle']}
          onReady={({loadedModules: [Map, MapView, Graphic, BasemapToggle], containerNode}) => {
            // this.setState({

            const map = new Map({
              basemap: 'oceans'
            });

            const mapView = new MapView({
              container: containerNode,
              center: [-3.2, 55.5],
              zoom: 6,
              map: map
            });

            const polyline = {
              type: "polyline",
              paths: this.state.testCoords
            };

            const pointAtt = {
              LocalityName: "Place Holder For Name",
              LocalityDescription: "Place Holder for Description",
              DataHeld: "Links to data:"
            };

            const multiPoints = {
              type: "multipoint",
              points: [
                [-2.68, 55.97],
                [-3.94, 56.12],
                [-3.51, 56.00],
              ]
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

            // })
          }}
        />
      </div>
    );
  }
}

export default MapContainer;
