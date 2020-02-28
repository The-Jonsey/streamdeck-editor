import React from 'react';
import ReactDOM from 'react-dom';
import './css/app.css';
import App from "./components/App";
const ipcRenderer = window.require('electron').ipcRenderer;

ipcRenderer.on("config", (event, args) => {
    let config = JSON.parse(args);
    ipcRenderer.on("deck-info", (event, arg) => {
        let deckInfo = JSON.parse(arg);
        ReactDOM.render(<App config={config} deckInfo={deckInfo}/>, document.getElementById('root'));
    });
    ipcRenderer.send("get-deck-info");
});

ipcRenderer.send("get-config");
