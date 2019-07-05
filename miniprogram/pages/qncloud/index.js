// miniprogram/pages/qncloud/index.js
const app = getApp()
const {PubSub} = app
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataSet:[],
    brick_option:{
      defaultExpandStatus: true,
      backgroundColor:  '#ababab',
      forceRepaint: false,
      columns: 2,
      imageFillMode: 'widthFix',
      icon:{
        fill:'http://qn001.pfotoo.com/images/see-ffff.svg',
        default:'http://qn001.pfotoo.com/images/see-ffff.svg'
      },
      fontColor:'#fefefe'
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    PubSub.on('reflush',res=>{
      this.getData(true)
    })
    this.getData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  getData(fouce=false){
    app.getPublishImages({
      act:'get'
    },fouce).then(res=>{
      console.log(res)
      let data=[];
      res.data.forEach(f=>{
        data.push({
          id: f._id,
          backgroundColor: f.imageAve?f.imageAve.RGB.replace("0x","#"):"",
          images: [f.url+'.lim.jpg'],
          time:parseInt(f.addtime||0),
          likedCount: parseInt(f.addtime||0),
          user: {
            avatar:'H',
            username: f.exif.Make.val+' '+f.exif.Model.val,
          },
        })
      })
      this.setData({
        dataSet:data
      })
    })
  },
  tapCard(e){
    console.log('tapCard(e)',e)
  },
})