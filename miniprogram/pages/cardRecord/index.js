/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-21 18:46:15
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-02-21 23:57:00
 * @FilePath: \tastygo\miniprogram\pages\cardRecord\index.js
 */

const { wxRequest } = require("../../utils/request");

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
        const username = app.globalData.userInfo.no;

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

        // const { account } = res.data.card[0];
        // res = await wxRequest('http://card.sztu.edu.cn/wechat/bill/all.html', {
        //     method: 'GET',
        //     data: {
        //         account,
        //         kaaccount: '',
        //         page: 1,
        //         rows: 100,
        //         startDate: '20210101',
        //         endDate: '20210131'
        //     },
        //     cookie,
        // });
    },

    async queryBalance(username, password) {
        const that = this;
        wx.showLoading({
            title: '查询中'
        });
        let res = await wxRequest('http://card.sztu.edu.cn/wechat/login/userLogin.html', {
            method: 'GET',
            data: {
                username,
                password,
                bind_type: 'sno'
            }
        });
        if (res.data.retcode !== '0') {
            wx.showToast({
                title: '密码错误',
                icon: 'none'
            });
        } else {
            const balance = res.data.card[0].db_balance / 100;
            that.setData({
                balance
            })
        }
        wx.hideLoading();
    },

})