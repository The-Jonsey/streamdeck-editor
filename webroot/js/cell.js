import {setSelectedCell} from "./index.js";

export default class Cell {

    constructor(config = {}, cell, index) {
        this._config = config;
        this._cell = cell;
        this._index = index;
        this._type = null;
        this._value = null;
        this._icon = null;
        this._text = null;
        this._textElem = null;
        this.parseConfig();
        this.handleCell()
    }

    parseConfig() {
        this._icon = this._config.icon ? this._config.icon : null;
        this._text = this._config.text ? this._config.text : null;
        if (this._config.hasOwnProperty("command")) {
            this._type = "command";
            this._value = this._config.command;
        } else if (this._config.hasOwnProperty("keybind")) {
            this._type = "keybind";
            this._value = this._config.keybind;
        } else if (this._config.hasOwnProperty("switch_page")) {
            this._type = "switch_page";
            this._value = this._config.switch_page;
        } else if (this._config.hasOwnProperty("url")) {
            this._type = "url";
            this._value = this._config.url;
        } else if (this._config.hasOwnProperty("brightness")) {
            this._type = "brightness";
            this._value = this._config.brightness;
        } else if (this._config.hasOwnProperty("write")) {
            this._type = "write";
            this._value = this._config.write;
        }
    }

    handleCell() {
        let cell = this.getCell();
        if (this._icon !== null) {
            cell.style.backgroundImage = "url(\"" + this._icon + "\")";
        }
        this._textElem = document.createElement("div");
        this.handleText();
        cell.appendChild(this._textElem);
        cell.onclick = () => {
            setSelectedCell(this);
            let selected = document.querySelectorAll(".selected");
            if (selected.length > 0) {
                selected[0].classList.remove("selected");
            }
            cell.classList.add("selected");
        }
    }

    getConfig() {
        this.cleanConfig();
        return this._config
    }

    cleanConfig() {
        for (let key of Object.keys(this._config)) {
            if (!this._config[key]) {
                delete this._config[key];
            }
        }
    }

    setConfig(config) {
        this._config = config;
        this.parseConfig();
        return this;
    }

    getCell() {
        return this._cell;
    }

    getIndex() {
        return this._index;
    }

    setIcon(icon) {
        this._icon = icon;
        this.getCell().style.backgroundImage = "url(\"" + this._icon + "\")";
        this.getConfig().icon = icon;
    }

    removeIcon() {
        this._icon = null;
        this.getCell().style.backgroundImage = "";
        this.getConfig().icon = "";
    }

    getType() {
        return this._type;
    }

    getValue() {
        return this._value;
    }

    getIcon() {
        return this._icon;
    }

    setText(text) {
        this._text = text;
        this.getConfig().text = text;
        this.handleText();
    }

    getText() {
        return this._text;
    }

    setType(type) {
        delete this.getConfig()[this._type];
        this._type = type;
        this.getConfig()[type] = "";
    }

    setValue(value) {
        this._value = value;
        this.getConfig()[this._type] = value;
    }

    clear() {
        this.setType("");
        this.setValue("");
        this.removeIcon();
    }

    handleText() {
        for (let child of this._textElem.children) {
            child.remove();
        }
        if (this._text) {
            this._textElem.innerHTML = `<svg width="72" height="72" viewBox="0 0 72 72">
        <text x="50%" y="50%" textLength="72px" dominant-baseline="central" text-anchor="middle" alignment-baseline="central"
        style="font-size: ` + this.calculateFontSize(this._text) + `%;">` + this._text + `</text>
        </svg>`;
        }
    }

    calculateFontSize(text) {
        let fontFamily = "16px sans-serif";
        let canvas = document.createElement('canvas');
        canvas.width = 72;
        canvas.height = 72;
        let ctx = canvas.getContext('2d');
        ctx.font = fontFamily;
        let width = ctx.measureText(text).width;
        let size = (1 / (width / 72)) * 100;
        return size < 500 ? size > 50 ? size : 50 : 500;
    }
}