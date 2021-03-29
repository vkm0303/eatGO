/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-21 18:46:15
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-03-17 23:02:15
 * @FilePath: \tastygo\miniprogram\pages\cardRecord\index.js
 */

const { wxRequest } = require("../../utils/request");
const { queryBalance } = require('../../api/api');

Page({
    data: {
        year: '2021',
        month: '01',
        balance: '0.00'
    },
    onLoad: async function(options) {
        const that = this;

        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getUTCDate();
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;
        const end = `${year}-${month}-${day}`;

        const app = getApp();
        const username = app.globalData.userInfo.campusId;

        let password = wx.getStorageSync('queryPassword');
        if (password) {
            that.queryBalance(username, password);
        } else {
            wx.showModal({
                title: '请输入查询密码',
                editable: true,
                showCancel: true,
                success: (result) => {
                    if (result.confirm) {
                        password = result.content;
                        that.queryBalance(username, password);
                        wx.setStorageSync('queryPassword', password);
                    }
                },
            });
        }

        that.setData({
            year,
            month,
            end,
        });
    },

    async queryBalance(username, password) {
        const that = this;
        wx.showLoading({
            title: '查询中'
        });
        const params = {
            username, //校园卡号
            password, //查询密码
            bind_type: 'sno' //卡类型
        }
        let res = await queryBalance(params);
        console.log(res)
        if (res.code != 200) {
            wx.showToast({
                title: res.msg,
                icon: 'none'
            });
        } else {
            const balance = res.data[0].db_balance / 100;
            that.setData({
                balance
            })
        }
        wx.hideLoading();
    },

})