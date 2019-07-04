// miniprogram/pages/qncloud/upload.js
const app = getApp()
const {PubSub} = app
console.log(app)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qnConf:{
      accessKey:'p7WjLuVs1GTpFRH_7mnZ0KidZfWXNh5_nW_2X_eJ',
      secretKey:'mWb6EV70xL2opJU1uwWk9Z7MyAUjPF8cLVwvd9x6',
      bucket:'fotoo',
      fileType:'image',
      region:'华东',
      domain:'http://qn001.pfotoo.com'
    },
    upConf:{
      prefixPath:'oxcc',//上传到七牛后有一个路径前缀，可为空；
      count:3,//文件数量
      loading:'leaf',// none|leaf|circle|ring, def leaf 上传的loading效果，none为无，可自行在page wxml中添加
      group:'def', //一个页面上多个组件的区分标识

    },
    files:[], //组件数据放入这里展示到页面上
    hasAddFile:true,//出现上传加号

    upConf2:{
      prefixPath:'oxcc',//上传到七牛后有一个路径前缀，可为空；
      count:4,//文件数量
      loading:'ring',// none|leaf|circle|ring, def leaf 上传的loading效果，none为无，可自行在page wxml中添加
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
  publish(e){
    let data=this.data.files.concat(this.data.files2);
    let hasSubmit=true
    data.forEach(f=>{
      if(f.progress!=100){
        hasSubmit=false;
        return false;
      }
    })
    if(!hasSubmit){
      return util.toast('请等待，有图片正在上传')
    }
    app.publish({
      act:'images',
      data:data,
    }).then(res=>{
      PubSub.emit('reflush',{
        act:'reflush'
      })
      wx.navigateBack();
    })
  },
})