import React, { Component } from 'react';
import './App.css';
// import UserList from './UserList';
import StateList from './StateList';

import Map from './Map';
// import 'mapbox-gl/dist/mapbox-gl.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          {/*<img src={process.env.PUBLIC_URL + '/img/grandstack.png'} className="App-logo" alt="logo" />*/}
          {/*<h1 className="App-title">Welcome to GRANDstack</h1>*/}
          <h1 className="App-title">B.R.A.I.N.S.</h1>
          
        </header>
        
        {/*<UserList />*/}
        <StateList />
        <Map />
      </div>
    );
  }
}

export default App;
