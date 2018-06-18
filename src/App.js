import React, { PureComponent } from 'react';
import EsriLoaderReact from 'esri-loader-react';
import './App.css'

class App extends PureComponent {

  constructor(props){
    super(props)
    this.state = {map: null}
  }

  render() {

    const options = {
      url: 'https://js.arcgis.com/4.7/'
    };

    return (
      <div className ="App">
        <EsriLoaderReact
          options={options}
          modulesToLoad={['esri/Map', 'esri/views/MapView']}
          onReady={({loadedModules: [Map, MapView], containerNode}) => {
            this.setState({
              view: new MapView({
                container: containerNode,
                center: [-3.2, 55.5],
                zoom: 6,
                map: new Map({basemap: 'satellite'})
              })
            })
          }}
        />
      </div>
    );
  }
}

export default App;
