import React from "react";
import "./App.css";
import PrimarySearchAppBar from "./Components/menuBar/PrimarySearchAppBar.js";
import IndiaMap from "./mapPage/IndiaMap.jsx"



export default function App() {

  return (
    <div className="App">
      <PrimarySearchAppBar />
      <IndiaMap />
    </div>
  );
}
