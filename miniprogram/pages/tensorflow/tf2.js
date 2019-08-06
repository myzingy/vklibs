// miniprogram/pages/tensorflow/tf1.js
var fetchWechat = require('fetch-wechat');
var tf = require('@tensorflow/tfjs-core');
var plugin = requirePlugin('tfjsPlugin');
const cocoSsd = require('@tensorflow-models/coco-ssd')
plugin.configPlugin({
  // polyfill fetch function
  fetchFunc: fetchWechat.fetchFunc(),
  // inject tfjs runtime
  tf,
  // provide webgl canvas
  canvas: wx.createOffscreenCanvas()
});
Page({
  data:{
    width:0,
    height:0,
  },
  async onReady() {
    const camera = wx.createCameraContext(this)
    this.canvas = wx.createCanvasContext('pose', this)
    this.loadPosenet()
    let count = 0
    this.listener = camera.onCameraFrame((frame) => {
      if(this.data.width<1){
        this.setData({
          width:frame.width,
          height:frame.height,
        })
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
  async loadPosenet() {
    this.drawBox(this.canvas,[100,300,120,30],'loading')
    this.canvas.draw()
    this.net = await cocoSsd.load({
      base: 'lite_mobilenet_v2',
      modelUrl: 'https://qn001.pfotoo.com/tfjs-models/savedmodel/ssdlite_mobilenet_v2/model.json',
    })
    console.log(this.net)
  },
  async detectPose(frame, net) {
    const imgData = {data: new Uint8Array(frame.data), width: frame.width, height: frame.height}
    // const imgSlice = tf.tidy(() => {
    //   const imgTensor = tf.browser.fromPixels(imgData, 4)
    //   return imgTensor.slice([0, 0, 0], [-1, -1, 3])
    // })
    //console.log('imgSlice',imgSlice)
    const poses = await net.detect(imgData)
    console.log('poses',poses)
    //imgSlice.dispose()//tf丈量销毁
    return poses
  },
  async drawPose(frame) {
    const poses = await this.detectPose(frame, this.net)
    if (this.canvas == null) return
    poses.forEach(pose=>{
      if (pose == null || this.canvas == null) return
      if (pose.score >= 0.5) {
        console.log('pose.score',pose)
        this.drawBox(this.canvas, pose.bbox,pose.class)
      }
    })
    this.canvas.draw()
  },
  drawBox(canvas, box,txt) {
    let bbox=[];
    box.forEach((v)=>{
      bbox.push(v/2)
    })
    let c=this.getColor(txt)
    canvas.setStrokeStyle(c)
    canvas.setFillStyle(c)
    canvas.strokeRect(bbox[0], bbox[1],bbox[2],bbox[3])
    canvas.setFontSize(14)
    canvas.fillText(txt, bbox[0]+5, bbox[1]+12)
  },
  color:{},
  getColor(txt){
    if(this.color[txt]){
      return this.color[txt]
    }
    let {r,g,b}={
      r:parseInt(Math.random()*255),
      g:parseInt(Math.random()*255),
      b:parseInt(Math.random()*255),
    }
    this.color[txt]='rgb('+r+','+g+','+b+')'
    return this.color[txt]
  },
  onUnload(){
    if(this.listener) this.listener.stop()
  },
})