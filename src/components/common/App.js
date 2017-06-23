import React, { Component } from 'react';
import '../../App.css';
import { Link } from 'react-router-dom';


import Home from './Home';

class App extends Component {
  render() {
    return (
      <div>
        <h1>EF Education First</h1>
        <ul className="header">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/students">Students</Link></li>
          <li><Link to="/configuration">Configuration</Link></li>
        </ul>
        <div className="content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default App;
