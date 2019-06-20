// miniprogram/pages/index/heatmap.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    width:360,
    height:500,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  HeatmapInterval:null,
  onLoad: function (options) {
    this.HeatmapInterval=setInterval(()=>{
      this.Heatmap();
    },3000)
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
    if(this.HeatmapInterval){
      clearInterval(this.HeatmapInterval);
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if(this.HeatmapInterval){
      clearInterval(this.HeatmapInterval);
    }
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
    this.PaletteCanvasInit();
    var context = wx.createCanvasContext('firstCanvas')

    var radius=50
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
      context.beginPath();
      context.arc(x, y, radius, 0, 2 * Math.PI);
      context.closePath();

      // 创建渐变色: r,g,b取值比较自由，我们只关注alpha的数值
      let radialGradient = context.createCircularGradient(x, y,radius);
      radialGradient.addColorStop(0.0, "rgba(0,0,0,1)");
      radialGradient.addColorStop(1.0, "rgba(0,0,0,0)");
      //context.fillStyle = radialGradient;
      context.setFillStyle(radialGradient)
      // 设置globalAlpha: 需注意取值需规范在0-1之间
      let globalAlpha = (value - min) / (max - min);
      context.setGlobalAlpha(Math.max(Math.min(globalAlpha, 1), 0));

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
        success:res=>{
          console.log('wx.canvasGetImageData',res)
          let ImageData = res.data;
          for (var i = 3; i < ImageData.length; i+=4) {
            let alpha = ImageData[i];
            let color = this.colorPicker(alpha);
            //let color = [200,99,99];
            ImageData[i - 3] = color[0];
            ImageData[i - 2] = color[1];
            ImageData[i - 1] = color[2];
          }
          wx.canvasPutImageData({
            canvasId:'firstCanvas',
            x:0,
            y:0,
            width:this.data.width,
            height:this.data.height,
            data:ImageData,
            success:res=> {
              console.log('wx.canvasPutImageData', res)
            }
          })
        }
      })
    },800)
  },
  PaletteImageData:null,
  PaletteCanvasInit(){
    var ctx = wx.createCanvasContext('PaletteCanvas')
    const defaultColorStops = {
      0: "#00ffff",
      2: "#00ff00",
      5: "#ffff00",
      10: "#ff0000",
    };
    const width = 256, height = 20;

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
          console.log('wx.canvasGetImageData',res)
          this.PaletteImageData = res.data;
        }
      })
    },300)
  },
  colorPicker(position){
    return this.PaletteImageData.slice(position * 4, position * 4 + 3);
  },
})