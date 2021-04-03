// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'tastygo-4giu9tldc5678879',
  traceUser: true
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {

  try {
    return await db.collection("empolyeeAccount").doc(event.account)
    .get()
  } catch (e) {
    console.log("调用失败",e)
  }
}