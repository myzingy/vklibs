//app.js
import {vk,regeneratorRuntime,PubSub} from 'vktool'
import request from 'request/index'
App({
  ...vk,
  ...request,
  PubSub:PubSub,
  regeneratorRuntime:regeneratorRuntime,
  globalData: {
    userInfo: null
  },
  onLaunch: function() {
    this.config({
      request:{
        responseKey:'Response', //Response 则使用网络请求状态判断，其它值则使用res.StatusKey 进行判断
        responseCode:200,   //正常返回结果 StatusKey的值 == StatusCode 视为正常结果

        responseKeyData:'content',   //错误信息的key
        responseKeyMsg:'msg',   //错误信息的key
      }
    })
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
  },
  onHide(){
    this.cache_clear()
  }
})