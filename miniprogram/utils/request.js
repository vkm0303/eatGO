/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-01 01:44:24
 * @LastEditors: AmsChen
 * @LastEditTime: 2021-05-15 22:49:50
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
                //'x-token': 'x-token' // 看自己是否需要
            },
            success(res) {
                resolve(res);
            },
            fail(error) {
                resolve(error);
            }
        })
    })
}

const wxUploadFile = (url, name, options) => {
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            filePath: options.path,
            name: name,
            url: url,
            header: {
                "Content-Type": "multipart/form-data",
                'accept': 'application/json'
            },
            formData: options,
            success(res) {
                res = JSON.parse(res);
                resolve(res);
            },
            fail(error) {
                console.log(error)
                resolve(error);
            }
        });
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

module.exports = {
    request,
    wxRequest,
    wxUploadFile,
};