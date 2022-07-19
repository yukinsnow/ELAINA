const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 500,
    height: 650,
    resizable: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

const {ipcMain, dialog} = require('electron')

ipcMain.on('open-file-dialog', (event) => {
  dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory']
  }).then(result => {
    //console.log(result.canceled)
    const path = result.filePaths[0]
    console.log(path)
    event.sender.send('selected-directory',path)
  }).catch(err => {
    console.log(err)
  })
})

ipcMain.on('show-video-meta', (event, path) => {
  var ffmpeg = require('ffmpeg');
  try {
		var process = new ffmpeg(path);
		process.then(function (video) {
			// Video metadata
			console.log(video.metadata);
			// FFmpeg configuration
			console.log(video.info_configuration);
		}, function (err) {
			console.log('Error: ' + err);
		});
	} catch (e) {
		console.log(e.code);
		console.log(e.msg);
	}

})