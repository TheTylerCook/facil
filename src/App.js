import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {

handleClick() {
  axios.get('/auth/me')
  .then(function(res) {
    console.log(res);
  })
}



  render() {
    return (
      <div className="App">
      <a href={process.env.REACT_APP_LOGIN}><button>Login</button></a>
      <button onClick={this.handleClick}>GET USER INFO</button>
      </div>
    );
  }
}

export default App;
