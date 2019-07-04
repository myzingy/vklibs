// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log("\n\rparams",event)
  return await saveQnImages(event)
}
async function saveQnImages(params){
  const db = cloud.database()
  const qnfiles = db.collection('qnfiles')
  params.data.forEach(async f=>{
    await qnfiles.add({
      // data 字段表示需新增的 JSON 数据
      data: {
        ...f.remote
      }
    })
  })
  return params.data;
}