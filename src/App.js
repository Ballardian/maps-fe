import React from "react";
import logo from "./logo.svg";
import "./App.css";
import routes from "./routes";
import { Link, Redirect, Route, Router, Switch } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Link to={routes.map}>Map</Link>
      </header>
    </div>
  );
}

export default App;
