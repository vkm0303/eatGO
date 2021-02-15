/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-10 23:59:20
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-02-14 18:16:02
 * @FilePath: \tastygo\miniprogram\utils\util.js
 */

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
};

const toTimeStamp = (timeStr='00:00:00') => {
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth()+1;
  let day = date.getDate();
  const now = year+'/'+month+'/'+day+' '+timeStr;
  let timeStamp = new Date(now).getTime();
  return timeStamp;
}

/**
 * @name: 陈俊任
 * @param {*Ptr that}
 * @param {*Number endTime}
 * @return {*}
 */
const timeCountDown = (that, endTime) => {
  let newTime = new Date().getTime();
  let remainTime = endTime - newTime;
  let obj = null;
  let t = '';
  // 如果未结束，对时间进行处理
  if (remainTime > 0) {
    let time = remainTime / 1000;
    // 获取天、时、分、秒
    let hou = parseInt(time % (60 * 60 * 24) / 3600);
    let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
    let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
    obj = {
      hou: formatNumber(hou),
      min: formatNumber(min),
      sec: formatNumber(sec)
    }
  }
  t = setTimeout(function() {
    that.setData({
      countDownTxt: obj
    });
    timeCountDown(that, endTime);
  }, 1000)
  if (remainTime <= 0) {
    clearTimeout(t);
  }
};

module.exports = {
  timeCountDown,
  toTimeStamp
};
