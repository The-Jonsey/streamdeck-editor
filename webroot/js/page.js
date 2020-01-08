import {deckInfo} from './index.js';
import Cell from "./cell.js";
export default class Page {

    constructor(index, config = [], table) {
        this._table = table;
        this._config = config;
        if (config.length < (deckInfo.rows * deckInfo.cols)) {
            for (let i = config.length; i < (deckInfo.rows * deckInfo.cols); i++) {
                config[i] = {};
            }
        }
        this._cells = [];
        this.createTable();
    }

    createTable() {
        let table = this.getTable();
        table.setAttribute("class", "table");
        for (let row = 0; row < deckInfo.rows; row++) {
            let rowElem = document.createElement("tr");
            for (let col = 0; col < deckInfo.cols; col++) {
                let cell = document.createElement("td");
                this._cells.push(new Cell(this.getConfig()[(row * 5) + col], cell, (row * 5) + col));
                rowElem.appendChild(cell);
            }
            table.appendChild(rowElem);
        }
    }

    getConfig() {
        return this._config;
    }

    setConfig(config) {
        this._config = config;
        return this;
    }

    getCells() {
        return this._cells;
    }

    getCell(i) {
        return this._cells[i];
    }

    getTable() {
        return this._table;
    }
}