const { hidden } = require('chalk')
const { app, BrowserWindow } = require('electron')
require('@electron/remote/main').initialize()

// Name the Electron Application
app.setName('Pilot Console')

app.on('ready', () => {
    const loadScreen = new BrowserWindow({
        show: false,
        frame: false,
        width: 600,
        height: 600,
        center: true,
        backgroundColor: '#272727',
        overflow: hidden
    })

    loadScreen.once('show', () => {
        // Define the Pilot Console Window Parameters
        const pilotConsoleWindow = new BrowserWindow({
            show: false,
            // width: 1366,
            // height: 768,
            width: 1900,
            height: 950,
            center: true,
            overflow: hidden,

            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true
            }
        })

        pilotConsoleWindow.webContents.once('ready-to-show', () => {
            // Allow App to Take Up All of the Available Screen <-- Uncomment the next line once development is complete ////
            // pilotConsoleWindow.maximize()
            pilotConsoleWindow.show()
            pilotConsoleWindow.focus()
            loadScreen.hide()
            loadScreen.close()
        })
        // Load Window from React App's Location
        pilotConsoleWindow.loadURL('http://localhost:3000')
    })
    // loadScreen.loadFile('loading.html')
    loadScreen.loadURL(`file://${__dirname}/loadscreen.html`)
    loadScreen.show()
})

// MacOS Event Listeners - Quit when all Windows Are Closed

app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        const pilotConsoleWindow = new BrowserWindow({
            // width: 1366,
            // height: 768,
            width: 1900,
            height: 950,
            center: true,
            overflow: hidden,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true
            }
        })

        // Load Window from React App's Location
        pilotConsoleWindow.loadURL('http://localhost:3000')

        // Allow App to Take Up All of the Available Screen <-- Uncomment the next line once development is complete ////
        // pilotConsoleWindow.maximize()
        pilotConsoleWindow.focus()
    }
})
