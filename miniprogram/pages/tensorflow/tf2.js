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
const BLC=0.95//0.72
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
      if (count === 2) {
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
    //console.log('poses',poses)
    //imgSlice.dispose()//tf丈量销毁
    return poses
  },
  async drawPose(frame) {
    const poses = await this.detectPose(frame, this.net)
    if (this.canvas == null) return
    let hasDraw=false;
    poses.forEach(pose=>{
      if (pose == null || this.canvas == null) return
      if (pose.score >= 0.5) {
        //console.log('pose.score',pose)
        hasDraw=true
        this.drawBox(this.canvas, pose.bbox,pose.class)
      }
    })
    if(hasDraw) this.canvas.draw()
  },
  drawBox(canvas, box,txt) {
    let bbox=[];
    box.forEach((v,i)=>{
      if(i==0 || i==2){
        bbox.push(parseInt(v*this.blc.w))
      }else{
        bbox.push(parseInt(v*this.blc.h))
      }

    })
    console.log(txt,bbox,this.blc)
    let c=this.getColor(txt)
    canvas.setStrokeStyle(c)
    canvas.setFillStyle(c)
    canvas.strokeRect(bbox[0]*BLC, bbox[1]*BLC,bbox[2]*BLC,bbox[3]*BLC)
    canvas.setFontSize(14)
    canvas.fillText(txt, (bbox[0]+5)*BLC, (bbox[1]+12)*BLC)
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