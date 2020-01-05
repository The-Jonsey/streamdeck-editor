const dbus = require("dbus-native");

module.exports = class DBus {


    constructor() {
        this.service = dbus.sessionBus().getService("com.thejonsey.streamdeck");
    }

    getInterface(cback) {
        this.service.getInterface("/com/thejonsey/streamdeck", "com.thejonsey.streamdeck", (err, iface) => {
            if (err) {
                console.error(
                    `Failed to request interface '${interfaceName}' at '${objectPath}' : ${
                        err
                    }`
                        ? err
                        : '(no error)'
                );
                process.exit(1);
            }
            cback(iface)
        });
    }

    getConfig(cback) {
        this.getInterface((iface) => {
            iface.GetConfig((err, str) => {
                if (err) {
                    console.log(err);
                }
                cback(str);
            })
        })
    }

    getDeckInfo(cback) {
        this.getInterface(iface => {
            iface.GetDeckInfo((err, str) => {
                if (err) {
                    console.log(err);
                }
                cback(str);
            })
        })
    }

    setConfig(config, cback) {
        this.getInterface(iface => {
            iface.SetConfig(config, (err, str) => {
                cback(str);
            })
        })
    }

    reload(cback) {
        this.getInterface(iface => {
            iface.ReloadConfig((err, str) => {
                cback(str);
            });
        });
    }

    setPage(page, cback) {
        this.getInterface(iface => {
            iface.SetPage(page, (err, str) => {
                cback(str);
            })
        })
    }

    listenToPage(cback) {
        this.getInterface(iface => {
            iface.on("Page", page => {
                cback(page);
            })
        })
    }
};
