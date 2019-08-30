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
    dz.selPeopleNum(5);
    this.setData({
      history:[dz.people]
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
  play(){
    dz.play();
    let history=this.data.history
    history.unshift(dz.people)
    this.setData({
      history:history
    })
  }
})