// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log("\n\rparams",event,"\n\r")
  switch (event.act){
    case 'images':
      return await saveQnImages(event)
      break;
    case 'get':
      return await getQnImages(event)
      break;
  }

}
async function saveQnImages(params){
  const db = cloud.database({
    env: 'prod-8888'
  })
  let files=JSON.parse(params.data)
  for(let i=0;i<files.length;i++){
    files[i].addtime=(new Date()/1000)
    await db.collection('qnfiles').add({
      data: files[i]
    })
    console.log("\n\rfile",files[i],"\n\r")
  }
  return files;
}
async function getQnImages(params){
  const db = cloud.database({
    env: 'prod-8888'
  })
  return await db.collection('qnfiles').orderBy('addtime', 'desc')
    .limit(100)
    .get()
}