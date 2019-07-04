// miniprogram/pages/qncloud/index.js
const app = getApp()
const {PubSub} = app
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataSet:[
      {
        id: '1',
        backgroundColor: '#fefefe',
        images: [
          'https://qn001.pfotoo.com/prefixPath/md435139.jpg.lim.jpg'
        ]
      },
      {
        id: '2',
        backgroundColor: '#AF7AC5',
        images: [
          'https://qn001.pfotoo.com/prefixPath/md464209.jpg.lim.jpg'
        ]
      }
    ],
    brick_option:{
      defaultExpandStatus: true,
      backgroundColor:  '#ababab',
      forceRepaint: false,
      columns: 2,
      imageFillMode: 'widthFix',
      icon:{
        fill:'xxx.com/icon-full.svg',
        default:'xxx.com/icon-default.svg'
      },
      fontColor:'#000'
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    PubSub.on('reflush',res=>{
      this.getData()
    })
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
  getData(){

  },
})