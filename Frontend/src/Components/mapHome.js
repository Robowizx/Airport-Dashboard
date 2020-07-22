import React from 'react';
import '../App.css';
import PrimarySearchAppBar from "./menuBar/PrimarySearchAppBar";
import IndiaMap from "./mapPage/IndiaMap.jsx";

function mapHome() {
    return (
        <div>
            <IndiaMap/>
        </div>
    )
}

export default mapHome;