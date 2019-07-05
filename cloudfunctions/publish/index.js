// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log("\n\rparams",event,"\n\r")
  return await saveQnImages(event)
}
async function saveQnImages(params){
  const db = cloud.database({
    env: 'prod-8888'
  })
  let files=JSON.parse(params.data)
  for(let i=0;i<files.length;i++){
    await db.collection('qnfiles').add({
      data: files[i]
    })
    console.log("\n\rfile",files[i],"\n\r")
  }
  return files;
}