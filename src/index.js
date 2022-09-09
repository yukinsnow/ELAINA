const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 500,
    height: 650,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const {ipcMain, dialog} = require('electron');
const { Stream } = require('stream');

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
  var ffmpeg = require('fluent-ffmpeg');
  var ffmpegPath = require('ffmpeg-static-electron');

  ffmpeg.setFfmpegPath = ffmpegPath;
  //var stream = fs.createWriteStream('outputfile.divx');

  var command = ffmpeg('/Users/yuki/Downloads/a.avi')
  .videoCodec('libx264')
  .on('error', function (err) {
    console.log('An error occurred: ' + err.message);
  })
  .on('end', function () {
    console.log('Processing finished!');
  })
  .save('/Users/yuki/Downloads/a.mp4');

  (function () {
    command.on('error', function () {
        console.log('Ffmpeg has been killed');
    });
    command.kill();
}, 60000);
})