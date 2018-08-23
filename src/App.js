import React, { Component } from 'react';
import './App.css';
import Table from './Table';

var api = require("./gapi-handler")

class App extends Component {
  state = {
    authorized: false
  }

  updateSigninStatus = status => {
    this.setState({authorized: status})
    this.fetchData()
  }

  fetchData = () => {
    api.fetchData(data => this.setState({ data }))
  }

  render() {
    api.initClient(this.updateSigninStatus)

    const { authorized, data } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <img src="https://www.iiit.ac.in/img/iiit-new.png" className="App-logo" alt="logo" />
          <h1 className="App-title">Shared Contacts Manager</h1>
        </header>
        <p className="App-intro">
          {authorized &&
            <button className="btn btn-primary" onClick={api.handleSignoutClick}>Logout</button>
          }
          {authorized && <Table data={data} refetchData={this.fetchData}/>}
          {!authorized &&
            <button className="btn btn-primary btn-lg" onClick={api.handleAuthClick}>Authorize</button>
          }
        </p>
      </div>
    );
  }
}

export default App;
