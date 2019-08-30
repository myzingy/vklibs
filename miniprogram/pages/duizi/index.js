// miniprogram/pages/duizi/index.js
import dz from './duizi'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    history:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  start(){
    dz.selPeopleNum(5);
    this.play()
  },
  play(){
    if(dz.people['p0'].hasPochan || dz.people['p0'].hasKaoan) {
      return this.setData({
        record:dz.record()
      })
    }
    dz.play();
    this.setData({
      history:dz.history
    })
    setTimeout(()=>{
      this.play()
    },300)
  }
})