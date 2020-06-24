/**
 * 利用favicon播放视频
 * @param {Number} videoWidth
 * @param {String} videoSrc
 */
class video2favicon {
    constructor (videoWidth, videoSrc) {
        this.videoWidth = videoWidth || 400
        this.videoSrc = videoSrc
        this.SIDE = 32
    }
    initCanvas () {
        this.canvas = document.createElement('canvas')
        this.canvas.width = this.canvas.height = this.SIDE
    }
    initVideo () {
        let video = document.createElement('video')
        video.width = this.videoWidth
        video.controls = 'controls'
        video.src = this.videoSrc
        video.crossOrigin = 'anonymous'
        video.autoplay = 'autoplay'
        document.body.appendChild(video)
        this.video = video
        this.bindVideoEvents()
    }
    bindVideoEvents () {
        this.video.addEventListener('timeupdate', () => {
            this.video2image()
        }, false)
    }
    video2image () {
        let ctx = this.canvas.getContext('2d')
        ctx.clearRect(0, 0, this.SIDE, this.SIDE)
        ctx.drawImage(this.video, 0, 0, this.SIDE, this.SIDE)
        this.setFavicon()
    }
    setFavicon () {
        let url = this.canvas.toDataURL('image/png')
        let icons = [...document.querySelector('head').querySelectorAll('link')]
            .filter(link => (link.getAttribute('rel') || '').includes('icon'))
        if (icons.length) {
            icons.forEach(icon => icon.setAttribute('href', url))
        } else {
            let icon = document.createElement('link')
            icon.setAttribute('rel', 'icon')
            icon.setAttribute('href', url)
            document.querySelector('head').appendChild(icon)
        }
    }
    init () {
        this.initCanvas()
        this.initVideo()
    }
}

module.exports = {
    video2favicon
}
