const { ipcRenderer } = require('electron');
let config;
let deckInfo;
let pages = [];
const pageList = document.getElementById("pages");
const tableList = document.getElementById("grid-container");
ipcRenderer.on("deck-info", (event, arg) => {
});
ipcRenderer.on("config", (event, arg) => {
    config = JSON.parse(arg);
    ipcRenderer.send("get-deck-info");
    ipcRenderer.on("deck-info", (event, arg) => {
        for (let i = 1; i <= config.length; i++) {
            let option = document.createElement("option");
            option.setAttribute("value", i-1);
            if (i === 1) {
                option.setAttribute("selected", "");
            }
            option.innerText = "Page " + i;
            pageList.appendChild(option);
            deckInfo = JSON.parse(arg);
            let table = document.createElement("table");
            pages.push({
                table,
                cells: [

                ]
            });
            table.setAttribute("class", "table");
            if (i === 1) {
                table.classList.add("active-table");
            }
            for (let j = 0; j < deckInfo.rows; j++) {
                let row = document.createElement("tr");
                for (let k = 0; k < deckInfo.cols; k++) {
                    let cell = document.createElement("td");
                    cell.setAttribute("x-cell", k + (j * 5));
                    if (config[i - 1].length >= k + j * 5) {
                        let cellConfig = config[i - 1][k + j * 5];
                        if (cellConfig !== undefined) {
                            if (cellConfig.hasOwnProperty("icon")) {
                                cell.style.backgroundImage = "url(\"file://" + cellConfig.icon + "\")";
                            } else if (cellConfig.hasOwnProperty("text")) {
                                cell.innerText = cellConfig.text;
                            }
                        }
                    }
                    cell.onclick = () => {
                        let selected = document.querySelectorAll(".selected");
                        if (selected.length > 0) {
                            selected[0].classList.remove("selected");
                        }
                        cell.classList.add("selected");
                        document.getElementById("selected").innerText = k + (j * 5);
                    };
                    pages[i - 1].cells.push(cell);
                    row.appendChild(cell);
                }
                table.appendChild(row);
            }
            tableList.appendChild(table);
        }
    });
});

ipcRenderer.send("get-config");
function setConfig(config) {
    ipcRenderer.send("set-config", JSON.stringify(config));

}
function reload() {
    ipcRenderer.send("reload");
}

pageList.oninput = () => {
    let pageNumber = parseInt(pageList.value);
    updatePage(pageNumber);
};

function updatePage(pageNumber, emit = true) {
    clear();
    pages[pageNumber].table.classList.add("active-table");
    if (emit) {
        ipcRenderer.send("set-page", pageNumber + "");
    }
}


function clear() {
    let selected = document.querySelectorAll(".selected");
    if (selected.length > 0) {
        selected[0].classList.remove("selected");
    }
    document.querySelectorAll(".active-table")[0].classList.remove("active-table");
    document.getElementById("selected").innerText = "";
}

ipcRenderer.on("page-updated", (event, arg) => {
    updatePage(arg, false);
    document.querySelectorAll("option:checked")[0].removeAttribute("selected");
    pageList.value = arg;
});
