import Page from './page.js';
const { ipcRenderer } = window.require('electron');

let config;
export let deckInfo;

let pages = [];

const pageList = document.getElementById("pages");
const tableList = document.getElementById("grid-container");

let currentPage;
let selectedCell = null;

const actionTypeInput = document.getElementById("action-type");
const actionInput = document.getElementById("action");
const iconInput = document.getElementById("icon-input");
const iconButton = document.getElementById("icon-button");
const removeIconButton = document.getElementById("remove-icon-button");
const submitButton = document.getElementById("submit");
const clearPageButton = document.getElementById("clear-page");
const addPageButton = document.getElementById("add-page");
const textInput = document.getElementById("text");
const setTextButton = document.getElementById("set-text");

ipcRenderer.on("config", (event, arg) => {
    config = JSON.parse(arg);
    window.config = config;
    ipcRenderer.send("get-deck-info");
    ipcRenderer.on("deck-info", (event, arg) => {
        deckInfo = JSON.parse(arg);
        for (let page = 0; page < config.length; page++) {
            let pageObj = setupPage(page);
            if (page === deckInfo.page) {
                pageObj.getTable().classList.add("active");
                currentPage = pageObj;
            }
        }
    });
});

ipcRenderer.send("get-config");

function setConfig() {
    ipcRenderer.send("set-config", JSON.stringify(config));
}

function commitConfig() {
    ipcRenderer.send("commit-config");
}

function reload() {
    ipcRenderer.send("reload");
}

pageList.oninput = () => {
    let pageNumber = parseInt(pageList.value);
    updatePage(pageNumber);
};

function updatePage(pageNumber, emit = true) {
    selectedCell = null;
    let selected = document.querySelectorAll(".selected");
    if (selected.length > 0) {
        selected[0].classList.remove("selected");
    }
    let active = document.querySelectorAll(".active");
    if (active.length > 0)
        active[0].classList.remove("active");
    disableInputs();
    clearInputs();
    let page = pages[pageNumber];
    page.getTable().classList.add("active");
    currentPage = page;
    if (emit) {
        ipcRenderer.send("set-page", pageNumber + "");
    }
}

ipcRenderer.on("page-updated", (event, arg) => {
    updatePage(arg, false);
    pageList.value = arg;
});

export function setSelectedCell(cell) {
    selectedCell = cell;
    enableInputs();
    clearInputs();
    if (cell.getType() != null) {
        actionTypeInput.value = cell.getType();
        actionInput.value = cell.getValue();
        textInput.value = cell.getText();
    }
}


function enableInputs() {
    actionInput.removeAttribute("disabled");
    actionTypeInput.removeAttribute("disabled");
    iconInput.removeAttribute("disabled");
    submitButton.removeAttribute("disabled");
    iconButton.removeAttribute("disabled");
    removeIconButton.removeAttribute("disabled");
    textInput.removeAttribute("disabled");
    setTextButton.removeAttribute("disabled");
}

function disableInputs() {
    actionInput.setAttribute("disabled", "");
    actionTypeInput.setAttribute("disabled", "");
    iconInput.setAttribute("disabled", "");
    submitButton.setAttribute("disabled", "");
    iconButton.setAttribute("disabled", "");
    removeIconButton.setAttribute("disabled", "");
    textInput.setAttribute("disabled", "");
    setTextButton.setAttribute("disabled", "");
}

function clearInputs() {
    actionInput.value = "";
    actionTypeInput.value = "";
    iconInput.value = "";
    textInput.value = "";
}

submitButton.onclick = () => {
    selectedCell.setType(actionTypeInput.value);
    selectedCell.setValue(actionInput.value);
    setConfig();
    commitConfig();
};

iconButton.onclick = () => {
    iconInput.click();
};

iconInput.oninput = () => {
    if (iconInput.files.length === 1) {
        selectedCell.setIcon(iconInput.files[0].path);
    }
};

removeIconButton.onclick = () => {
    selectedCell.removeIcon();
};

setTextButton.onclick = () => {
    selectedCell.setText(textInput.value);
}

function setupPage(page) {
    let table = document.createElement("table");
    let pageOption = document.createElement("option");
    let pageObj = new Page(page, config[page], table);
    pages.push(pageObj);
    pageOption.innerText = "Page " + (page + 1);
    pageOption.value = page;
    pageList.appendChild(pageOption);
    tableList.appendChild(table);
    return pageObj;
}

addPageButton.onclick = () => {
    let page = pages.length;
    let pageObj = setupPage(page);
    config.push(pageObj.getConfig());
    setConfig();
    commitConfig();
};

clearPageButton.onclick = () => {
    if (confirm("Are you sure? this isn't reversible")) {
        currentPage.clear();
        setConfig();
        commitConfig();
    }
};