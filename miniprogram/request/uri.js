/////////////////////////////
// 封装 uri
/////////////////////////////
export default {
  //__开始为私有属性，不会暴露给getApp
  '__HOST':'http://api.qingyunke.com/',

  //示例，JS接口名，和服务端接口名称保持一致
  'ApiOneTwo':{
    method:'GET',       //支持 wx.requst 的所有参数，在这里都可以重新制定，否则使用app.config()配置的参数；
    alias:'api.php',  //真实接口地址,外面的key和接口名不一致时可以增加这个；或者服务端改了接口名称，只需要在这里写一个alias即可
    loading:true,       //loading效果 ，默认不带loading;         为 true 时带loading
    cachetime:5,          //缓存 0无,-1永久,单位秒，一天86400秒;    默认 0 不缓存
    host:''             //默认空,使用HOST，可填写为其它host
  },

  //全部使用默认参数
  'AppReserveSmsBuy':null,

  //publish
  'publish':{
    alias:'wx.cloud.callFunction', //必须
    apiName:'publish',      //必须
    loading:true,       //loading效果 ，
    cachetime:0,        //缓存 0无
  },

  //tcbService-ai-detectFace
  'detectFace':{
    alias:'wx.cloud.callFunction', //必须
    apiName:'tcbService-ai-detectFace',      //必须
    loading:true,       //loading效果 ，
    cachetime:0,        //缓存 0无
  },
  //publish
  'getPublishImages':{
    alias:'wx.cloud.callFunction', //必须
    apiName:'publish',      //必须
    loading:true,       //loading效果 ，
    cachetime:600,        //缓存 0无
  }
}
