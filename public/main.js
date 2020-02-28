// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const DBus = require("./dbus");

require('electron-reload')(__dirname);

function createWindow () {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        frame: true,
        transparent: true,
        titleBarStyle: 'hidden',
        icon: path.join(__dirname, 'logo.png'),
        webPreferences: {
            nodeIntegration: true
        }
    });

    //mainWindow.setMenu(null);

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, '/../build/index.html'));

    // Open the DevTools.
    //mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const dbus = new DBus();

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
