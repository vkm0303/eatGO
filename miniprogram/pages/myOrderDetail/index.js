/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-13 14:23:30
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-02-13 21:19:42
 * @FilePath: \tastygo\miniprogram\pages\myOrderDetail\index.js
 */
Page({
  data: {
    getWay: ''
  },
  onLoad: function (options) {
    const that = this;
    that.setData({
      getWay: 'bydelivery'
    });
  },
})