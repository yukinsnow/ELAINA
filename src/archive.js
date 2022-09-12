const { ipcRenderer } = require("electron");

//Tab control
const archiveButton = document.getElementById("archiveButton");
archiveButton.addEventListener("click", function (e) {
  window.location.href = "archive.html";
});

const homeButton = document.getElementById("homeButton");
homeButton.addEventListener("click", function (e) {
  window.location.href = "index.html";
});

const audioButton = document.getElementById("audioButton");
audioButton.addEventListener("click", function (e) {
  window.location.href = "audio.html";
});

//function
const selectVideoButton = document.getElementById("selectVideoButton");
const inputVideo = document.getElementById("inputVideo");
selectVideoButton.addEventListener("click", function (e) {
  OpenDialog();
});

const replaceButton = document.getElementById("replaceButton");
replaceButton.addEventListener("click", function (e) {
  ReplaceAudio();
});


function OpenDialog() {
  ipcRenderer.send("open-file-dialog");
  ipcRenderer.on("selected-item", (event, path) => {
    inputVideo.value = `${path}`;
  });
}

function ReplaceAudio() {
    const path = inputVideo.value;
    console.log(path);
    ipcRenderer.send("replace-audio", (event, path));
  }