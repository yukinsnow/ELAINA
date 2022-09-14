const { ipcRenderer } = require("electron");
const fs = require("fs");

//Binding
var videoName = "";

//Input
const videoInputPath = document.getElementById("videoInputPath");
const audioInputPath = document.getElementById("audioInputPath");
const videoOutputPath = document.getElementById("videoOutputPath");
const videoBitrateInput = document.getElementById("videoBitrateInput");
const videoFPSInput = document.getElementById("videoFPSInput");
const audioBitrateInput = document.getElementById("audioBitrateInput");
const resWideInput = document.getElementById("resWideInput");
const resHeightInput = document.getElementById("resHeightInput");
const logInput = document.getElementById("logInput");

//Button
const selectVideoButton = document.getElementById("selectVideoButton");
selectVideoButton.addEventListener("click", function (e) {
  SelectVideo();
});

const selectAudioButton = document.getElementById("selectAudioButton");
selectAudioButton.addEventListener("click", function (e) {
  SelectAudio();
});

const selectOutputButton = document.getElementById("selectOutputButton");
selectOutputButton.addEventListener("click", function (e) {
  SelectOutput();
});

const encodeButton = document.getElementById("encodeButton");
encodeButton.addEventListener("click", function (e) {
  logInput.innerHTML = "编码中~";
  EncodeVideo();
});

const replaceButton = document.getElementById("replaceButton");
replaceButton.addEventListener("click", function (e) {
  logInput.innerHTML = "替换音频中~";
  ReplaceAudio();
});

const extractButton = document.getElementById("extractButton");
extractButton.addEventListener("click", function (e) {
  logInput.innerHTML = "提取音频中~";
  ExtractAudio();
});

//Select
const videoCodecSelect = document.getElementById("videoCodecSelect");
const audioCodecSelect = document.getElementById("audioCodecSelect");
const videoFormatSelect = document.getElementById("videoFormatSelect");

//Drag&Drop
//VideoInput
videoInputPath.addEventListener("drop", (e) => {
  //阻止默认行为
  e.preventDefault();
  //获取文件列表
  const files = e.dataTransfer.files;

  if (files && files.length > 0) {
    //获取文件路径
    var path = files[0].path;
    console.log("视频输入:", path);
    videoInputPath.value = path;
    var pos = videoInputPath.value.lastIndexOf("/");
    videoOutputPath.value = videoInputPath.value.substr(0, pos);
    var videoNameTemp = videoInputPath.value.substr(pos + 1); //824.mp4
    var pos2 = videoNameTemp.lastIndexOf(".");
    videoName = videoNameTemp.substr(0, pos2);
  }
});

//阻止拖拽结束事件默认行为
videoInputPath.addEventListener("dragover", (e) => {
  e.preventDefault();
});

//AudioInput
audioInputPath.addEventListener("drop", (e) => {
  e.preventDefault();
  const files = e.dataTransfer.files;

  if (files && files.length > 0) {
    var path = files[0].path;
    console.log("音频输入:", path);
    audioInputPath.value = path;
  }
});

audioInputPath.addEventListener("dragover", (e) => {
  e.preventDefault();
});

//VideoOutput
videoOutputPath.addEventListener("drop", (e) => {
  e.preventDefault();
  const files = e.dataTransfer.files;

  if (files && files.length > 0) {
    var path = files[0].path;
    console.log("视频输出:", path);
    videoOutputPath.value = path;
  }
});

videoOutputPath.addEventListener("dragover", (e) => {
  e.preventDefault();
});

//function
function SelectVideo() {
  ipcRenderer.send("open-videofile-dialog");
  ipcRenderer.on("selected-video", (event, value) => {
    videoInputPath.value = `${value}`;
    var pos = videoInputPath.value.lastIndexOf("/");
    videoOutputPath.value = videoInputPath.value.substr(0, pos);
    var videoNameTemp = videoInputPath.value.substr(pos + 1); //824.mp4
    var pos2 = videoNameTemp.lastIndexOf(".");
    videoName = videoNameTemp.substr(0, pos2);
  });
}

function SelectAudio() {
  ipcRenderer.send("open-audiofile-dialog");
  ipcRenderer.on("selected-audio", (event, value) => {
    audioInputPath.value = `${value}`;
  });
}

function SelectOutput() {
  ipcRenderer.send("select-output-dialog");
  ipcRenderer.on("selected-output", (event, value) => {
    videoOutputPath.value = `${value}`;
  });
}

function EncodeVideo() {
  var videoInput = videoInputPath.value;
  var videoOutput = videoOutputPath.value;
  var videoBitrate = videoBitrateInput.value;
  var videoFPS = videoFPSInput.value;
  var audioBitrate = audioBitrateInput.value;
  var resWide = resWideInput.value;
  var resHeight = resHeightInput.value;

  var videoCodecIndex = videoCodecSelect.selectedIndex;
  var videoCodec = videoCodecSelect.options[videoCodecIndex].value;
  var audioCodecIndex = audioCodecSelect.selectedIndex;
  var audioCodec = audioCodecSelect.options[audioCodecIndex].value;
  var videoFormatIndex = videoFormatSelect.selectedIndex;
  var videoFormat = videoFormatSelect.options[videoFormatIndex].value;

  console.log(videoInput + videoOutput);
  if (!(!videoInput && !videoOutput)) {
    //两者不能为空
    ipcRenderer.send(
      "encode-video",
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
    );

    ipcRenderer.on("send-log", (event, log) => {
      logInput.innerHTML = `${log}`;
    });
  } else {
    logInput.innerHTML = "文件不能为空！";
  }
}

function ReplaceAudio() {
  var videoInput = videoInputPath.value;
  var audioInput = audioInputPath.value;
  var videoOutput = videoOutputPath.value;

  var videoFormatIndex = videoFormatSelect.selectedIndex;
  var videoFormat = videoFormatSelect.options[videoFormatIndex].value;

  if (!(!videoInput && !videoOutput) && audioInput) {
    ipcRenderer.send(
      "replace-audio",
      videoInput,
      audioInput,
      videoOutput,
      videoFormat,
      videoName
    );

    ipcRenderer.on("send-log", (event, log) => {
      logInput.innerHTML = `${log}`;
    });
  } else {
    logInput.innerHTML = "文件不能为空！";
  }
}

function ExtractAudio() {
  var videoInput = videoInputPath.value;
  var audioInput = audioInputPath.value;
  var videoOutput = videoOutputPath.value;
  if (!(!videoInput && !videoOutput)) {
    ipcRenderer.send(
      "extract-audio",
      videoInput,
      audioInput,
      videoOutput,
      videoName
    );

    ipcRenderer.on("send-log", (event, log) => {
      logInput.innerHTML = `${log}`;
    });
  } else {
    logInput.innerHTML = "文件不能为空！";
  }
}
