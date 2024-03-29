
<h1 align="center">
  <br>
  <a href="https://github.com/yukinsnow/ELAINA"><img src="https://github.com/yukinsnow/ELAINA/blob/main/src/icons/icon.png" alt="ELAINA" width="100"></a>
  <br>
  ELAINA
  <br>
</h1>

<h4 align="center">A simple video encoding, transcoding tool built on top of <a href="http://electron.atom.io" target="_blank">Electron</a>.</h4>

<h4 align="center"><a href="https://app.travis-ci.com/yukinsnow/ELAINA"><img src="https://app.travis-ci.com/yukinsnow/ELAINA.svg?token=xQBfDUHExzq5p7L364LA&branch=main" alt="ELAINA"></h4>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#translate">Translate</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#download">Download</a> •
  <a href="#credits">Credits</a> •
  <a href="#related">Related</a> •
  <a href="#license">License</a>
</p>

<h4 align="center">
<img src="https://github.com/yukinsnow/ELAINA/blob/main/screenshot.png" alt="screenshot" width="500">
</h4>

## Key Features

* Simple video re-encoding
* Replacing audio tracks in existing videos
* Extracting the audio track from the video
* Cross platform
  - Windows, macOS and Linux ready.
  - Support x86 and arm64.

## Download & Install
You can [download](https://github.com/yukinsnow/ELAINA/releases) the latest installable version of ELAINA for Windows or macOS. If you are using Linux, please build from source.

**macOS Troubleshooting**
If macOS prompts you that `App is damanged, you should move it to the trash`, run the command below in the terminal:
```bash
xattr -c /Applications/ELAINA.app
```

## Build & Development

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/yukinsnow/ELAINA

# Go into the repository
$ cd ELAINA

# Install dependencies
$ npm install

# Run the app
$ npm start
```

> **Note**
> If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.


## Translations
The interface of this app is written in Chinese and an English translation is provided here.  
| 中文      | English |
| ----------- | ----------- |
| 视频         | Video       |
| 音频         | Audio        |
| 输出         | Output       |
| 编码         | Codec        |
| 码率         | Bitrate        |
| 分辨率        | Resolution        |
| 容器         | Format        |
| 提取         | Extract        |
| 替换         | Replace        |
| 压制         | Encode        |

## Credits

This software uses the following open source packages:

- [Electron](http://electron.atom.io/)
- [Node.js](https://nodejs.org/)
- [electron-forge](https://github.com/electron-userland/electron-forge)
- [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg)
- [ffmpeg-static-electron](https://github.com/pietrop/ffmpeg-static-electron)
- [photon](https://github.com/connors/photon/)

## Related

[markdownify-web](https://github.com/amitmerchant1990/markdownify-web) - Web version of Markdownify


## License

GPL  

The image of Elaina is from the anime ‘Wandering Witch: The Journey of Elaina’ and this app is for open source non-profit use.

---

> yukinsnow (Programer) &nbsp;&middot;&nbsp;
> GitHub [@yukinsnow](https://github.com/yukinsnow) &nbsp;&middot;&nbsp;
> Twitter [@yukinsnow](https://twitter.com/yukinsnow)  
> 童心圆 (Illustrator) &nbsp;&middot;&nbsp;
> bilibili [@童心圓](https://space.bilibili.com/358219200)