const {app,BrowserWindow} = require('electron')
const path = require('path')
const createWindow = () => {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 1200,
        minHeight: 800,
        center: true,
        skipTaskbar: false,
        transparent: false,
        webPreferences: {
            contextIsolation: false,
            webSecurity: false,
            nodeIntegration: true,
            enableRemoteModule: true,
        }
    })
    let env = 'pro2'
    // 配置热更新
    if (env == 'pro') {
        const elePath = path.join(__dirname, '../node_modules/electron')
        require('electron-reload')('../', {
            electron: require(elePath),
        })
        win.loadURL(
            'http://localhost:8888/'
        )

        win.webContents.openDevTools()
    } else {
        // 生产环境中要加载文件，打包的版本
        // Menu.setApplicationMenu(null)
        // 加载 index.html
        win.loadFile(path.resolve(__dirname, '../dist/index.html')) // 新增
    }

}

app.whenReady().then(() => {
    createWindow()
})

/**
 * @Description: 限制只能打开一个页面
 * @CreationDate 2023-05-20 14:35:52
 */
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (win) {
            if (win.isMinimized()) win.restore()
            win.focus()
        }
    })
}

app.on('window-all-closed', function () {
    if(process.platform !== 'darwin') app.quit()
})
