// Auto reloading
require('electron-reload')(__dirname);

const {app, BrowserWindow, ipcMain} = require("electron");
const dbus = new (require("./dbus.js"))();

process.title = "streamdeck-editor";

let mainWindow;

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        frame: true,
        transparent: true,
       // titleBarStyle: 'hidden',
        webPreferences: {
            nodeIntegration: true
        }
    });

  //  mainWindow.setMenu(null);

    mainWindow.loadFile("./webroot/index.html");

}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow()
});


ipcMain.on("get-deck-info", (event) => {
    dbus.getDeckInfo((info) => {
        event.reply("deck-info", info);
    });
    dbus.listenToPage(page => {
        event.reply("page-updated", page);
    });
});

ipcMain.on('get-config', (event) => {
    dbus.getConfig((config) => {
        event.reply("config", config);
    })
});

ipcMain.on('set-config', (event, arg) => {
    dbus.setConfig(arg, (status) => {
        event.reply("status", status);
    })
});

ipcMain.on("reload", (event) => {
    dbus.reload((status) => {
        event.reply("reload", status);
    })
});

ipcMain.on("set-page", (event, arg) => {
    dbus.setPage(arg, status => {
        event.reply("page-set", status);
    })
});

ipcMain.on("commit-config", (event, arg) => {
    dbus.commitConfig(status => {
        event.reply("config-committed", status);
    })
});