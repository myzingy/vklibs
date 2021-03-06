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
const BLC=1//0.72
Page({
  data:{
    width:10,
    height:10,
  },
  blc:{
    w:0.5,
    h:0.5,
  },
  async onReady() {
    const camera = wx.createCameraContext(this)
    this.canvas = wx.createCanvasContext('pose', this)
    this.loadPosenet()
    let count = 0
    this.listener = camera.onCameraFrame((frame) => {
      if(this.blc.w==0.5 && this.data.width!=10){
        this.blc={
          w:(this.data.width)/frame.width ,
          h:(this.data.height)/frame.height,
        }
      }
      count++
      if (count === 3) {
        if (this.net) {
          this.drawPose(frame)
        }
        count = 0
      }
    })
    this.listener.start()
  },
  onShow(){
    wx.getSystemInfo({
      success:res=>{
        //console.log(res)
        this.setData({
          width:res.windowWidth*0.7,
          height:res.windowHeight*0.7,
        })
      },
    })
  },
  async loadPosenet() {
    const POSENET_URL =
      'https://www.gstaticcnapps.cn/tfjs-models/savedmodel/posenet/mobilenet/float/050/model-stride16.json';
    this.net = await posenet.load({
      architecture: 'MobileNetV1',
      outputStride: 16,
      inputResolution: 193,
      multiplier: 0.5,
      modelUrl:POSENET_URL,
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
    canvas.arc(x*this.blc.w * BLC, y*this.blc.h * BLC, 3, 0, 2 * Math.PI)
    canvas.fillStyle = 'aqua'
    canvas.fill()
  },
  drawLine(canvas, pos0, pos1) {
    canvas.beginPath()
    canvas.moveTo(pos0.x*this.blc.w * BLC, pos0.y*this.blc.h * BLC)
    canvas.lineTo(pos1.x*this.blc.w * BLC, pos1.y*this.blc.h * BLC)
    canvas.lineWidth = 2
    canvas.strokeStyle = `aqua`
    canvas.stroke()
  },
  onUnload(){
    if(this.listener) this.listener.stop()
  },
})