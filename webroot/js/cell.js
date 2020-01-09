import { setSelectedCell } from "./index.js";

export default class Cell {

    constructor(config = {}, cell, index) {
        this._config = config;
        this._cell = cell;
        this._index = index;
        this._type = null;
        this._value = null;
        this._icon = null;
        this.parseConfig();
        this.handleCell()
    }

    parseConfig() {
        this._icon = this._config.icon ? this._config.icon : null;
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
        return this._config
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
}