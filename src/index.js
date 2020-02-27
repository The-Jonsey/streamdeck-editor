import React from 'react';
import ReactDOM from 'react-dom';
import './css/app.css';
import * as serviceWorker from './serviceWorker';
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
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
