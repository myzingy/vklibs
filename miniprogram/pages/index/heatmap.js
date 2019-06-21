// miniprogram/pages/index/heatmap.js
const app = getApp()
const {regeneratorRuntime} = app
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width:360,
    height:500,
  },
  hasRun:true,//可以运行
  hasRunning:false,//正在运行
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      width:app.globalData.width,
      height:app.globalData.height-app.globalData.CustomBar
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.Heatmap();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  Heatmap(){
    this.hasRunning=false;
    if(!this.hasRun) return;
    this.hasRunning=true;
    this.PaletteCanvasInit();
    var context = wx.createCanvasContext('firstCanvas')

    var radius=20
    let min=0,max=100,count=20;
    // x, y 表示二维坐标； value表示强弱值
    var data = [
      {x: this.data.width/2, y: this.data.height/2, value: 100}
    ];
    for(let i=0;i<count;i++){
      data.push({
        x:parseInt(Math.random()*this.data.width),
        y:parseInt(Math.random()*(this.data.height-25)),
        value:parseInt(Math.random()*max),
      })
    }




    /*
     * radius: 绘制半径，请自行设置
     * min, max: 强弱阈值，可自行设置，也可取数据最小最大值
     */
    data.forEach(point => {
      let {x, y, value} = point;
      let radiusFix=radius+value/2
      context.beginPath();
      context.arc(x, y, radiusFix, 0, 2 * Math.PI);
      context.closePath();

      // 创建渐变色: r,g,b取值比较自由，我们只关注alpha的数值
      let radialGradient = context.createCircularGradient(x, y,radiusFix);
      let alpha = (value - min) / (max - min);
      alpha = Math.max(Math.min(alpha, 1), 0)
      radialGradient.addColorStop(0.0, "rgba(0,0,0,"+alpha+")");
      radialGradient.addColorStop(1.0, "rgba(0,0,0,0)");
      //context.fillStyle = radialGradient;
      context.setFillStyle(radialGradient)
      // 设置globalAlpha: 需注意取值需规范在0-1之间
      //let globalAlpha = (value - min) / (max - min);
      //context.setGlobalAlpha(Math.max(Math.min(globalAlpha, 1), 0));

      // 填充颜色
      context.fill();
    });
    context.draw()

    setTimeout(()=>{
      wx.canvasGetImageData({
        canvasId:'firstCanvas',
        x:0,
        y:0,
        width:this.data.width,
        height:this.data.height,
        success:async (res)=>{

          let ImageData = res.data;
          for (var i = 3; i < ImageData.length; i+=4) {
            let alpha = ImageData[i];
            let color = this.colorPicker(alpha);
            //let color = [200,99,99];
            ImageData[i - 3] = color[0];
            ImageData[i - 2] = color[1];
            ImageData[i - 1] = color[2];
          }
          //console.log('wx.canvasGetImageData',ImageData.length)
          let maxWirteLength=750000;//程序最大写入数据
          let maxWirteHeight=parseInt(maxWirteLength/4/this.data.width);//屏幕最大写入Height
          let maxWirteStep=maxWirteHeight*4*this.data.width;//屏幕最大写入数据
          let hasLast=false
          for(let wi=0;wi<ImageData.length;wi+=maxWirteStep){
            let y=parseInt((wi/4)/this.data.width);
            let rightPos=wi+maxWirteStep;
            if(rightPos>ImageData.length){
              rightPos=ImageData.length;
              hasLast=true;
            }

            let height=parseInt(((rightPos-wi)/4)/this.data.width);
            //console.log('ImageData.slice:',wi,rightPos)
            let idata=ImageData.slice(wi,rightPos);
            try{
              await this.canvasPutImageData(y,height,idata)
            }catch (e){}
            if(hasLast){
              setTimeout(()=>{
                this.Heatmap();
              },2000)
            }
          }

        }
      })
    },800)
  },
  canvasPutImageData(y,height,ImageData){
    let width=this.data.width;
    return new Promise(function(success,fail){
      wx.canvasPutImageData({
        canvasId:'firstCanvas',
        x:0,
        y:y,
        width:width,
        height:height,
        data:ImageData,
        success:res=> {
          success()
        },
        fail:()=>{
          fail()
        },
        complete:res=>{
          console.log({
            y:y,
            height:height,
            data:ImageData.length,
            errMsg:res.errMsg
          })
        }
      })
    })
  },
  PaletteImageData:null,
  PaletteCanvasInit(){
    var ctx = wx.createCanvasContext('PaletteCanvas')
    const defaultColorStops = {
      0: "#00ffff",
      3: "#ffff00",
      10: "#ff0000",
    };
    const width = 256, height = 5;

    let linearGradient = ctx.createLinearGradient(0, 0, width, 0);
    for (const key in defaultColorStops) {
      linearGradient.addColorStop(parseFloat(key/10), defaultColorStops[key]);
    }
    // 绘制渐变色条
    ctx.setFillStyle(linearGradient)
    ctx.fillRect(0, 0, width, height);
    ctx.draw();

    setTimeout(()=>{
      wx.canvasGetImageData({
        canvasId:'PaletteCanvas',
        x:0,
        y:0,
        width:256,
        height:1,
        success:res=>{
          //console.log('wx.canvasGetImageData',res)
          this.PaletteImageData = res.data;
        }
      })
    },300)
  },
  colorPicker(position){
    return this.PaletteImageData.slice(position * 4, position * 4 + 3);
  },
  StopRun(){
    this.hasRun=!this.hasRun
    if(this.hasRun && !this.hasRunning){
      this.Heatmap();
    }
  }
})