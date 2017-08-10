import React, { Component } from 'react';
import './App.css';
import Checklist from '../checklist/checklist';

class App extends Component {
  render() {
    return (
      <div className="app">
        <h1><span className='title--thin'>PR /</span> Checklist</h1>
        <Checklist />
      </div>
    );
  }
}

export default App;
