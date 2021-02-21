/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-21 21:39:48
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-02-21 21:42:31
 * @FilePath: \tastygo\test.js
 */
var request = require('request');
console.log(request({
    url: 'query/balance.html',
    method: 'GET',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36 QBCore/4.0.1316.400 QQBrowser/9.0.2524.400 Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2875.116 Safari/537.36 NetType/WIFI MicroMessenger/7.0.20.1781(0x6700143B) WindowsWechat'
    }
}))