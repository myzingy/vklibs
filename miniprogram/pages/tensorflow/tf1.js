// miniprogram/pages/tensorflow/tf1.js
var fetchWechat = require('fetch-wechat');
var tf = require('@tensorflow/tfjs-core');
var plugin = requirePlugin('tfjsPlugin');
const posenet = require('@tensorflow-models/posenet')
plugin.configPlugin({
  // polyfill fetch function
  fetchFunc: fetchWechat.fetchFunc(),
  // inject tfjs runtime
  tf,
  // provide webgl canvas
  canvas: wx.createOffscreenCanvas()
});
Page({

  async onReady() {
    const camera = wx.createCameraContext(this)
    this.canvas = wx.createCanvasContext('pose', this)
    this.loadPosenet()
    let count = 0
    const listener = camera.onCameraFrame((frame) => {
      count++
      if (count === 3) {
        if (this.net) {
          this.drawPose(frame)
        }
        count = 0
      }
    })
    listener.start()
  },
  async loadPosenet() {
    this.net = await posenet.load({
      architecture: 'MobileNetV1',
      outputStride: 16,
      inputResolution: 193,
      multiplier: 0.5
    })
    console.log(this.net)
  },
  async detectPose(frame, net) {
    const imgData = {data: new Uint8Array(frame.data), width: frame.width, height: frame.height}
    const imgSlice = tf.tidy(() => {
      const imgTensor = tf.browser.fromPixels(imgData, 4)
      return imgTensor.slice([0, 0, 0], [-1, -1, 3])
    })
    //console.log('imgSlice',imgSlice)
    const pose = await net.estimateSinglePose(imgSlice, {flipHorizontal: false})
    //console.log('pose',pose)
    imgSlice.dispose()//tf丈量销毁
    return pose
  },
  async drawPose(frame) {
    const pose = await this.detectPose(frame, this.net)
    if (pose == null || this.canvas == null) return
    if (pose.score >= 0.3) {
      console.log('pose.score',pose)
      // Draw circles
      for (let i in pose.keypoints) {
        const point = pose.keypoints[i]
        if (point.score >= 0.5) {
          //console.log('point.position',point.position)
          const {y, x} = point.position
          this.drawCircle(this.canvas, x, y)
        }
      }
      // Draw lines
      const adjacentKeyPoints = posenet.getAdjacentKeyPoints(pose.keypoints, 0.3)
      for (let i in adjacentKeyPoints) {
        const points = adjacentKeyPoints[i]
        this.drawLine(this.canvas, points[0].position, points[1].position)
      }
      this.canvas.draw()
    }
  },
  drawCircle(canvas, x, y) {
    canvas.beginPath()
    canvas.arc(x * 0.72, y * 0.72, 3, 0, 2 * Math.PI)
    canvas.fillStyle = 'aqua'
    canvas.fill()
  },
  drawLine(canvas, pos0, pos1) {
    canvas.beginPath()
    canvas.moveTo(pos0.x * 0.72, pos0.y * 0.72)
    canvas.lineTo(pos1.x * 0.72, pos1.y * 0.72)
    canvas.lineWidth = 2
    canvas.strokeStyle = `aqua`
    canvas.stroke()
  }
})