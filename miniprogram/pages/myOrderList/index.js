/*
 * @Description: 
 * @Author: AS
 * @Date: 2021-02-11 14:23:03
 * @LastEditors: AS
 * @LastEditTime: 2021-02-11 15:41:37
 * @FilePath: \tastygo\miniprogram\pages\myOrderList\index.js
 */
Page({

  data: {
    orderList: [
      { 
        getWay: '送餐上门',
        getTime: '12:32',
        details: [
          {
            foodName: '叉烧饭',
            num: 1,
          },
          {
            foodName: '烧鸭饭',
            num: 2
          },
          {
            foodName: '咸鸡饭',
            num: 1,
          }
        ],
        createTime: '2021.02.11',
        status: 0
      },
      {
        getWay: '自提',
        getTime: '12:38',
        details: [
          {
            foodName: '叉烧饭',
            num: 1,
          },
          {
            foodName: '烧鸭饭',
            num: 2
          },
          {
            foodName: '咸鸡饭',
            num: 1,
          },
        ],
        createTime: '2021.02.16',
        status: 1
      }
    ]
  },

  onLoad: function (options) {
    
  },

  onShow: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  },

  cancelOrder() {

  }
})