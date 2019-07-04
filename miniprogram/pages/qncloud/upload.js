// miniprogram/pages/qncloud/upload.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qnConf:{
      accessKey:'七牛的accessKey',
      secretKey:'七牛的secretKey',
      bucket:'fotoo',//存储空间
      fileType:'image',//image|video|audio|file def:file
      region:'华东',//存储区域
      domain:'http://xxx.xxxx.com',//你绑定的域名,非必填项
    },
    upConf:{
      prefixPath:'prefixPath',//上传到七牛后有一个路径前缀，可为空；（还会自动强制带一个日期前缀）
      count:3,//文件数量
      loading:'leaf',// none|leaf|circle|ring, def leaf 上传的loading效果，none为无，可自行在page wxml中添加
      group:'def', //一个页面上多个组件的区分标识

    },
    files:[], //组件数据放入这里展示到页面上
    hasAddFile:true,//出现上传加号

    upConf2:{
      prefixPath:'prefixPath',//上传到七牛后有一个路径前缀，可为空；（还会自动强制带一个日期前缀）
      count:4,//文件数量
      loading:'leaf',// none|leaf|circle|ring, def leaf 上传的loading效果，none为无，可自行在page wxml中添加
      group:'def', //一个页面上多个组件的区分标识

    },
    files2:[], //组件数据放入这里展示到页面上
    hasAddFile2:true,//出现上传加号
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
  qnevent(e){
    console.log('qnevent',e.detail);
    this.setData({
      files:e.detail.data,
      hasAddFile:e.detail.data.length<this.data.upConf.count
    })
  },
  qnevent2(e){
    console.log('qnevent2',e.detail);
    this.setData({
      files2:e.detail.data,
      hasAddFile2:e.detail.data.length<this.data.upConf2.count
    })
  },
})