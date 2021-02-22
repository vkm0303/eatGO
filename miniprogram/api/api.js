/*
 * @Description: api管理
 * @Author: 陈俊任
 * @Date: 2021-02-01 01:44:13
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-02-22 22:18:03
 * @FilePath: \tastygo\miniprogram\api\api.js
 */

const { request } = require('../utils/request.js');
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

//请求菜品详情
const getMenuDetail = async(menuId) => {
    let { data } = await request.get(`${apiBaseUrl}/getMenuDetail?menuId=${menuId}`)
    return data;
}

//请求菜单数据，url需要食堂id及餐点
const getMenuList = async(url) => {
    let { data } = await request.get(`${apiBaseUrl}${url}`)
    return data;
};

//通过食堂id获取菜单
const getMenuByCanteen = async(id, day) => {
    let { data } = await request.get(`${apiBaseUrl}/getMenuByCanteen`, { canteenId: id, day: day })
    return data;
};

//请求收获地点列表
const getAddressList = async() => {
    let { data } = await request.get(`${apiBaseUrl}/getAddressList`);
    return data;
};

//添加订单
const submitOrder = async(order) => {
    let { data } = await request.post(`${apiBaseUrl}/addOrder`, order);
    return data;
}

//添加用户
const reg = async(userInfo) => {
    let { data } = await request.post(`${apiBaseUrl}/addCampusUser`, userInfo);
    return data;
};


const api = {
    getCanteenList,
    getTypeList,
    getMenuList,
    getMenuDetail,
    getMenuByCanteen,
    getAddressList,
    submitOrder,
    reg,
};

module.exports = api;