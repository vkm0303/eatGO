// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
    env: 'tastygo-4giu9tldc5678879'
})
const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
    return await db.collection(event.collectionName).get()
}