/*
 * @Description: api管理文件
 * @Author: 陈俊任
 * @Date: 2021-02-01 01:44:13
 * @LastEditors: AS
 * @LastEditTime: 2021-02-09 17:06:49
 * @FilePath: \好吃GO\miniprogram\api\api.js
 */

import request from '../utils/request.js';
const app = getApp();
const { apiBaseUrl } = app.globalData;

//请求饭堂列表
const getCanteenList = async(url) => {
    let result = {};
    await request.get(`${apiBaseUrl}${url}`).then(res => {
        result = res.data;
    });
    return result;
}

//请求菜品类型列表
const getTypeList = async(url) => {
    let result = {};
    await request.get(`${apiBaseUrl}${url}`).then(res => {
        result = res.data;
    });
    return result;
};

//请求菜单数据，url需要食堂id及餐点
const getMenuList = async(url) => {
    let result = {};
    await request.get(`${apiBaseUrl}${url}`).then(res => {
        result = res.data;
    });
    return result;
};


const api = {
    getCanteenList,
    getTypeList,
    getMenuList,
};

module.exports = api;