const { ipcRenderer } = require('electron')

const selectVideoButton = document.getElementById('selectVideoButton')
const inputVideo = document.getElementById('inputVideo')
selectVideoButton.addEventListener('click', function(e) {
    OpenDialog()
})

const compressButton = document.getElementById('compressButton')
compressButton.addEventListener('click', function(e) {
    ShowVideoMeta()
})

function OpenDialog()
{
    ipcRenderer.send('open-file-dialog')
       ipcRenderer.on('selected-directory', (event, path) => {
        inputVideo.value = `${path}`
       })
}

function ShowVideoMeta()
{
    console.log("sss")
    const path = inputVideo.value;
    ipcRenderer.send('show-video-meta', (event, path))
}