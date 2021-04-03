/*
 * @Description: api管理
 * @Author: 陈俊任
 * @Date: 2021-02-01 01:44:13
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-03-28 13:40:57
 * @FilePath: \tastygo\miniprogram\api\api.js
 */

const { request } = require('../utils/request.js');
const app = getApp();
const { apiBaseUrl } = app.globalData;

//请求饭堂列表
const getCanteenList = async() => {
    let { data } = await request.get(`${apiBaseUrl}/getCanteenList`)
    return data;
};

//请求菜品类型列表
const getTypeList = async(url) => {
    let { data } = await request.get(`${apiBaseUrl}${url}`);
    return data;
};

//请求菜品详情
const getMenuDetail = async(menuId) => {
    let { data } = await request.get(`${apiBaseUrl}/getMenuDetail?menuId=${menuId}`);
    return data;
};

//请求菜单数据，url需要食堂id及餐点
const getMenuList = async(url) => {
    let { data } = await request.get(`${apiBaseUrl}${url}`)
    return data;
};

//通过食堂id获取菜单
const getMenuByCanteen = async(params) => {
    let { data } = await request.get(`${apiBaseUrl}/getMenuByCanteen`, params);
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
};

//接单
const receiveOrder = async(params) => {
    let { data } = await request.post(`${apiBaseUrl}/receiveOrder`, params);
    return data;
};

//取消订单
const cancelOrder = async(params) => {
    let { data } = await request.post(`${apiBaseUrl}/cancelOrder`, params);
    return data;
};

//修改订单状态
const changeOrderStatus = async(params) => {
    let { data } = await request.post(`${apiBaseUrl}/changeOrderStatus`, params);
    return data;
};

//获取所有订单
const getOrder = async(params) => {
    let { data } = await request.get(`${apiBaseUrl}/getOrder`, params);
    return data;
};

const getUserOrder = async(params) => {
    let { data } = await request.get(`${apiBaseUrl}/getUserOrder`, params);
    return data;
};

//获取用户所有订单
const getOrderByUser = async(params) => {
    let { data } = await request.get(`${apiBaseUrl}/getOrderByUser`, params);
    return data;
};

//获取订单详情
const getOrderDetail = async(params) => {
    let { data } = await request.get(`${apiBaseUrl}/getOrderById`, params);
    return data;
};

//筛选
const filterOrder = async(params) => {
    let { data } = await request.get(`${apiBaseUrl}/filterOrder`, params);
    return data;
};

//教务系统认证
const auth = async(params) => {
    let { data } = await request.post(`${apiBaseUrl}/auth`, params);
    return data;
};

//添加用户
const reg = async(userInfo) => {
    let { data } = await request.post(`${apiBaseUrl}/addCampusUser`, userInfo);
    return data;
};

//更新用户信息
const updateUserInfo = async(params) => {
    let { data } = await request.post(`${apiBaseUrl}/updateCampusUserDetail`, params);
    return data;
};

//获取用户信息
const getUserInfo = async(params) => {
    let { data } = await request.get(`${apiBaseUrl}/getUserInfo`, params);
    return data;
};

//查询校园卡余额
const queryBalance = async(params) => {
    let { data } = await request.post(`${apiBaseUrl}/weChatLogin`, params);
    return data;
}


const api = {
    getCanteenList,
    getTypeList,
    getMenuList,
    getMenuDetail,
    getMenuByCanteen,
    getAddressList,
    submitOrder,
    receiveOrder,
    cancelOrder,
    getOrder,
    filterOrder,
    getUserOrder,
    getOrderByUser,
    getOrderDetail,
    changeOrderStatus,
    auth,
    reg,
    updateUserInfo,
    getUserInfo,
    queryBalance,
};

module.exports = api;