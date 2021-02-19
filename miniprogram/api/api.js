/*
 * @Description: api管理
 * @Author: 陈俊任
 * @Date: 2021-02-01 01:44:13
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-02-19 22:55:00
 * @FilePath: \tastygo\miniprogram\api\api.js
 */

import request from '../utils/request.js';
const app = getApp();
const { apiBaseUrl } = app.globalData;

//请求饭堂列表
const getCanteenList = async() => {
    let { data } = await request.get(`${apiBaseUrl}/getCanteenList`)
    return data;
}

//请求菜品类型列表
const getTypeList = async(url) => {
    let { data } = await request.get(`${apiBaseUrl}${url}`)
    return data;
};

//请求菜单数据，url需要食堂id及餐点
const getMenuList = async(url) => {
    let { data } = await request.get(`${apiBaseUrl}${url}`)
    return data;
};

//请求收获地点列表
const getAddressList = async() => {
    let { data } = await request.get(`${apiBaseUrl}/getAddressList`);
    return data;
};


const api = {
    getCanteenList,
    getTypeList,
    getMenuList,
    getAddressList,
};

module.exports = api;