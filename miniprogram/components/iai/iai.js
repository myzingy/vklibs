/* global wx, Component */
const MODES = ['DetectFace']
let imgUrl = 'https://10.url.cn/eth/ajNVdqHZLLBn1TC6loURIX2GB5GB36NBNZtycXDXKGARFHnJwhHD8URMvyibLIRBTJrdcONEsVHc/'
const app = getApp()
Component({
  data: {
    fileID: null,
    hasUploaded: false,
    faceRects: [],
    resMap: {
      Gender: {
        label: '性别',
        valMap: { 0: '女', 1: '男' },
      },
      Age: { label: '年龄' },
      Expression: {
        label: '微笑',
        valMap: { 0: '否', 1: '是' },
      },
      Glass: { label: '是否有眼镜' },
      Beauty: { label: '魅力' },
      Hat: { label: '是否有帽子' },
      Mask: { label: '是否有口罩' },
      Score: { label: '质量分' },
      Sharpness: { label: '清晰分' },
      Brightness: { label: '光照分' },
    },

    qnConf:{
      accessKey:'ZUHvYeKtuiwWK7sLy2ABvrRWnYXjNLcdxoqvOihe',
      secretKey:'xsw0f3qRAEQluUhvJW4QN5nwHCYjjLKi1A9iSoyO',
      bucket:'linligo',
      fileType:'image',
      region:'华东',
      domain:'http://009-img.vking.wang'
    },
    upConf:{
      prefixPath:'oxcc',//上传到七牛后有一个路径前缀，可为空；
      count:1,//文件数量
      loading:'leaf',// none|leaf|circle|ring, def leaf 上传的loading效果，none为无，可自行在page wxml中添加
      group:'def', //一个页面上多个组件的区分标识
      sizeType:['compressed'],  //['original', 'compressed']
      sourceType:['album', 'camera'], //['album', 'camera'] 选择图片的来源
    },
    files:[], //组件数据放入这里展示到页面上
    hasAddFile:true,//出现上传加号
  },
  attached(){
    this.errCount=0;
  },
  methods: {
    async qnevent(e){
      console.log('qnevent',e);
      this.setData({
        imgUrl:e.detail.data[0].path,
        files:e.detail.data,
        //hasAddFile:e.detail.data.length<this.data.upConf.count
      })
      if("uploadCompleted"==e.detail.act){
        await this.callFunction(e.detail.data[0]);
      }else{
        this.setData({
          faceRects: [],
        });
      }
    },
    async callFunction(f) {
      wx.showLoading({
        title: '识别中',
        icon: 'none',
      });

      let funcName = this.data.mode;
      if (MODES.indexOf(funcName) === -1) throw new Error(`未知识别模式: ${funcName}`);
      console.log('callFunction(f)',f);
      try {
        let result = await app.detectFace({
          Url:f.remote.url+'.lim.jpg?imageView2/3/w/980'
        })
        wx.hideLoading();

        if (!result.code && result.data) {
          this.setData({
            faceRects: this.getFaceRects(result.data),
          }, () => {
            this.triggerEvent('finish', result.data);
          })
        }
        else {
          wx.showToast({
            title: '识别出错：'+result.message,
            icon: 'none',
          })
          if(result.code==10005){
            if(this.errCount<1){
              setTimeout(()=>{
                this.errCount++
                this.callFunction(f)
              },1000)
            }else{
              this.errCount=0;
            }

          }

        }
      }
      catch (e) {
        wx.hideLoading();
        wx.showToast({
          title: '识别失败',
          icon: 'none',
        })
        console.log(e);
      }
    },

    // 计算人脸位置
    getFaceRects(res) {
      const { ImageWidth, ImageHeight, FaceInfos } = res;
      return FaceInfos.map(item => ({
        ...item,
        rectX: (item.X / ImageWidth) * 100 + '%',
        rectY: (item.Y / ImageHeight) * 100 + '%',
        rectWidth: (item.Width / ImageWidth) * 100 + '%',
        rectHeight: (item.Height / ImageHeight) * 100 + '%',
      }));
    }
  },

  properties: {
    uploadText: {
      type: String,
      value: '上传人脸',
    },
    recognizeText: {
      type: String,
      value: '识别人脸',
    },
    imgUrl: {
      type: String,
      value: imgUrl,
    },
    mode: {
      type: String,
    },
  },
});