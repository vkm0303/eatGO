/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-01 01:44:24
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-02-01 02:06:18
 * @FilePath: \miniprogram\utils\request.js
 */

const app = getApp()
const wxRequest = (url, options) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: url,
            method: options.method,
            data: options.method === 'GET' ? options.data : JSON.stringify(options.data),
            header: {
                'Content-Type': 'application/json; charset=UTF-8',
                'x-token': 'x-token' // 看自己是否需要
            },
            success(request) {
                if (request.data.code === 200) {
                    resolve(request.data)
                } else {
                    reject(request.data)
                }
            },
            fail(error) {
                reject(error.data)
            }
        })
    })
}

const get = (url, options = {}) => {
    return wxRequest(url, { method: 'GET', data: options })
}

const post = (url, options) => {
    return wxRequest(url, { method: 'POST', data: options })
}

const put = (url, options) => {
    return wxRequest(url, { method: 'PUT', data: options })
}

// 不能声明DELETE（关键字）
const remove = (url, options) => {
    return wxRequest(url, { method: 'DELETE', data: options })
}

const request = {get, post, put, remove };

module.exports = request;