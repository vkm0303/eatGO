/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-10 23:59:19
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-02-23 22:03:01
 * @FilePath: \tastygo\miniprogram\pages\login\index.js
 */

const { reg } = require('../../api/api');

var account = ''
var password = ''

Page({
    data: {
        isVisible: true,
        login_id: true
    },
    onLoad: function(options) {

    },
    //切换登录身份
    handleChangeId() {
        this.setData({ login_id: !this.data.login_id })
    },
    //显示/隐藏密
    handlePasswordVisit() {
        this.setData({ isVisible: !this.data.isVisible })
    },
    accInput(e) {
        account = e.detail.value
    },
    psdInput(e) {
        password = e.detail.value
    },
    //登录事件
    handleLogin(e) {
        wx.showLoading({
            title: "验证中",
            mask: true
        })
        const { userInfo, encryptedData } = e.detail;
        wx.request({
            url: 'https://isztu.tytion.net/api/login',
            data: {
                username: account,
                password
            },
            method: 'POST',
            success: async(result) => {
                console.log(result)
                if (result.data.ret) {
                    let realname = result.data.msg.split('(')[0];
                    let account = result.data.msg.split('(')[1].split(')')[0];
                    userInfo.realname = realname;
                    userInfo.no = account;

                    let res = await reg({
                        campusId: userInfo.no,
                        unionId: '0',
                        realname,
                        nickname: userInfo.nickName,
                        avatar: userInfo.avatarUrl,
                    });
                    if (res.msg !== 'fail') {
                        wx.setStorageSync('userInfo', userInfo);
                        wx.setStorageSync('loginState', true);
                        wx.switchTab({ url: '/pages/my/index' });
                    } else {
                        wx.showToast({
                            title: '登录失败',
                            icon: 'none'
                        });
                    }
                } else {
                    wx.showToast({
                        title: '账号/密码错误',
                        icon: 'none'
                    });
                }
            },
            fail: () => {
                wx.showToast({
                    title: '登录失败',
                    icon: 'none'
                });
            },
            complete: () => {
                wx.hideLoading();
            }
        });
    },
    login() {
        var name = ""
        var no = ""
        try {
            wx.cloud.callFunction({
                name: 'login',
                data: {
                    account: account,
                    password: password
                }
            }).then(res => {
                console.log(res)
                name = res.result.name
                no = res.result.no
            })
            return { name: name, no: no }
        } catch {}
    }
})