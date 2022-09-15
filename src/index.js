const { app, BrowserWindow } = require("electron");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static-electron"); //built-in ffmpeg binaries
console.log(ffmpegPath.path); //ffmpeg binaries path
ffmpeg.setFfmpegPath(ffmpegPath.path);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 500,
    height: 650,
    icon: "./icons/icon.png",
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const { ipcMain, dialog } = require("electron");
const { Stream } = require("stream");

ipcMain.on("open-videofile-dialog", (event) => {
  dialog
    .showOpenDialog({
      properties: ["openFile"],
      filters: [
        { name: "Movies", extensions: ["mp4", "avi", "mov","flv","mkv"] },
        { name: "All Files", extensions: ["*"] },
      ],
    })
    .then((result) => {
      //console.log(result.canceled)
      const value = result.filePaths[0];
      //console.log(value);
      event.sender.send("selected-video", value);
    })
    .catch((err) => {
      console.log(err);
    });
});

ipcMain.on("open-audiofile-dialog", (event) => {
  dialog
    .showOpenDialog({
      properties: ["openFile"],
      filters: [
        { name: "Audio", extensions: ["wav", "mp3", "aac"] },
        { name: "All Files", extensions: ["*"] },
      ],
    })
    .then((result) => {
      //console.log(result.canceled)
      const value = result.filePaths[0];
      //console.log(value);
      event.sender.send("selected-audio", value);
    })
    .catch((err) => {
      console.log(err);
    });
});

ipcMain.on("select-output-dialog", (event) => {
  dialog
    .showOpenDialog({
      properties: ["openDirectory"],
    })
    .then((result) => {
      //console.log(result.canceled)
      const value = result.filePaths[0];
      //console.log(value);
      event.sender.send("selected-output", value);
    })
    .catch((err) => {
      console.log(err);
    });
});

//compress
ipcMain.on(
  "encode-video",
  (
    event,
    videoInput,
    videoOutput,
    videoCodec,
    videoBitrate,
    videoFPS,
    audioCodec,
    audioBitrate,
    resWide,
    resHeight,
    videoFormat,
    videoName
  ) => {
    var ffmpeg = require("fluent-ffmpeg");
    var ffmpegPath = require("ffmpeg-static-electron"); //built-in ffmpeg binaries
    var log;
    //console.log(ffmpegPath.path); //ffmpeg binaries path
    ffmpeg.setFfmpegPath(ffmpegPath.path);

    console.log(
      "Encode with " +
      videoCodec +
      " " +
      videoBitrate +
      " " +
      videoFPS +
      " " +
      audioCodec +
      " " +
      audioBitrate +
      " " +
      resWide +
      "x" +
      resHeight +
      " " +
      videoFormat +
      " " +
      videoName
    );

    var command = ffmpeg(videoInput)
      .videoCodec(videoCodec)
      .videoBitrate(videoBitrate)
      .fps(videoFPS)
      .audioCodec(audioCodec)
      .audioBitrate(audioBitrate)
      .size(resWide + "x" + resHeight)
      .format(videoFormat)
      .on("error", function (err) {
        log = "编码出错：" + err.message;
        console.log(log);
        event.sender.send("send-log", log);
      })
      .on("end", function () {
        log = "编码完成！";
        console.log(log);
        event.sender.send("send-log", log);
      })
      .save(videoOutput + "/" + videoName + "." + videoFormat);

    (function () {
      command.on("error", function () {
        console.log("Ffmpeg has been killed");
      });
      command.kill();
    },
      60000);
  }
);

//Replace-Audio function
ipcMain.on(
  "replace-audio",
  (event, videoInput, audioInput, videoOutput, videoFormat, videoName) => {
    console.log("Replace " + videoInput + " with " + audioInput);
    var command = ffmpeg(videoInput)
      .input(audioInput)
      .audioCodec("copy")
      .outputOptions([
        "-map 0:v:0",
        "-map 1:a:0", //Merge first input's video stream and second input's audio stream.
      ])
      .on("error", function (err) {
        log = "编码出错：" + err.message;
        console.log(log);
        event.sender.send("send-log", log);
      })
      .on("end", function () {
        log = "音频替换完成！";
        console.log(log);
        event.sender.send("send-log", log);
      })
      .save(videoOutput + "/" + videoName + "_mux." + videoFormat);

    (function () {
      command.on("error", function () {
        console.log("Ffmpeg has been killed");
      });
      command.kill();
    },
      60000);
  }
);

//Extract-Audio function
ipcMain.on("export-audio", (event, videoInput, videoOutput, audioOutput, videoName) => {

  //I think this is a bug that i must pass two output to ensure at least one parameter has value.
  //If I just pass one audioOuput or videoOuput, it will be null.(bug?)
  //So I need to pass these two parameter, although I just one of them.
  console.log("this is audio out:" + audioOutput);
  console.log("this is video out:" + videoOutput);


  var command = ffmpeg(videoInput)
    .noVideo()
    .audioCodec("pcm_s16le")
    .on("error", function (err) {
      log = "编码出错：" + err.message;
      console.log(log);
      event.sender.send("send-log", log);
    })
    .on("end", function () {
      log = "音频提取完成！";
      console.log(log);
      event.sender.send("send-log", log);
    })
    .save(audioOutput + "/" + videoName + "_extract.wav");

  (function () {
    command.on("error", function () {
      console.log("Ffmpeg has been killed");
    });
    command.kill();
  },
    60000);
});