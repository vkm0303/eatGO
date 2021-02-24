const cloud = require('wx-server-sdk')
const request = require('request-promise')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})
exports.main = async (event, context) => {
  // let res = await request({url:'https://api.weixin.qq.com/sns/jscode2session?appid=wx2d37530643ea06bc&secret=b0d9e79dbbe9e39863c7fc561de0da9c&js_code=083Qf50w3Qg0UV200P3w3Jaafz0Qf50U&grant_type=authorization_code',method: 'get'})
  // console.log(res)
  try {
    const result = await cloud.openapi.subscribeMessage.send({
        touser: 'o4lhJ44HMa34rIrgmUzKa9BkYOs0',
        page: 'menu',
        lang: 'zh_CN',
        data: {
          phrase1: {
            value: '菜单'
          },
          date3: {
            value: '2015年01月05日'
          },
          thing5: {
            value: 'TIT创意园'
          },
        },
        templateId: 'GJbSl6GvGB_Emo1J3cHLeZlGzBZe9LtR1IjNtOiYeWk',
        miniprogramState: 'developer'
      })
    return result
  } catch (err) {
    return err
  }
}