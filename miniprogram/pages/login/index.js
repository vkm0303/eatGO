/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-10 23:59:19
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-04-03 18:54:31
 * @FilePath: \tastygo\miniprogram\pages\login\index.js
 */

const { reg, getUserInfo, auth } = require('../../api/api');
const { request } = require('../../utils/request');

var account = ''
var password = ''

Page({
    data: {
        isVisible: true,
        login_id: true,
        isHideAgreement: true,
        isAgree: false,

    },
    onLoad: function (options) {

    },
    //切换登录身份
    handleChangeId() {
        this.setData({
            login_id: !this.data.login_id
        })
    },

    //显示/隐藏密
    handlePasswordVisit() {
        this.setData({
            isVisible: !this.data.isVisible
        })
    },

    accInput(e) {
        account = e.detail.value
    },

    psdInput(e) {
        password = e.detail.value
    },

    //登录事件
    async handleLogin(e) {
        if (!this.data.isAgree) {
            wx.showToast({
                title: '请先阅读并同意协议',
                icon: 'none'
            });
            return;
        }
        wx.showLoading({
            title: "验证中",
            mask: false
        });
        
        if (this.data.login_id) {
            let { userInfo, encryptedData, iv } = e.detail;
            let result = await auth({username: account, password});
            console.log(result)
            if (result.code == 200) {
                let realname = result.data.split('(')[0];
                let account = result.data.split('(')[1].split(')')[0];
                userInfo.realname = realname;
                userInfo.campusId = account;
                wx.login({
                    timeout: 10000,
                    success: async(r) => {
                        const params = {
                            campusId: userInfo.campusId,
                            realname,
                            encryptedData,
                            code: r.code,
                            iv,
                            nickname: userInfo.nickName,
                            avatar: userInfo.avatarUrl,
                        };
                        let res = await reg(params);
                        if (res.code !== 500) {
                            res = await getUserInfo({ id: userInfo.campusId });
                            if (res.code === 200) {
                                userInfo = res.data;
                                wx.setStorageSync('userInfo', userInfo);
                                wx.setStorageSync('loginState', true);
                                wx.switchTab({ url: '/pages/my/index' });
                            } else {
                                wx.showModal({
                                    title: '提示',
                                    content: '未知错误，请尝试重新登录',
                                    showCancel: false,
                                    confirmText: '确定',
                                    confirmColor: '#76aef2',
                                });
                            }
                        } else {
                            wx.showModal({
                                title: '提示',
                                content: '登录失败',
                                showCancel: false,
                                confirmText: '确定',
                                confirmColor: '#76aef2'
                            });
                        }
                    },
                });
            } else {
                wx.showModal({
                    title: '提示',
                    content: result.data.msg,
                    showCancel: false,
                    confirmText: '确定',
                    confirmColor: '#76aef2'
                });
            }
            wx.hideLoading();
        } else {
            var that = this;
            if (account.length == 0 || password.length == 0) {
                wx.showToast({
                    icon: 'none',
                    title: '不能为空',
                })
                return
            };
            wx.showLoading({
                title: '验证中，请稍后',
            })
            wx.cloud.database().collection("empolyeeAccount").doc(account).get({
                success(res) {
                    console.log("数据库获取成功", res.data.account)
                    var user = res.data
                    if (password == user.password) {
                        wx.showToast({
                            title: '登录成功',
                        });
                        wx.redirectTo({
                            url: '../employeeEnd/employeeEnd',
                        });
                        wx.setStorageSync('user', user);
                    } else {
                        console.log("登录失败");
                        wx.showToast({
                            title: '用户名或密码错误',
                            icon: 'none'
                        })
                    }
                },
                fail(res) {
                    console.log("数据库获取失败", res)
                    wx.showToast({
                        title: '登录失败',
                        icon: 'none'
                    })
                }
            })
        }
    },

    checkedChange() {
        const that = this;
        const {
            isAgree
        } = that.data;
        let isHideAgreement = true;
        if (!isAgree) {
            isHideAgreement = false;
        }
        that.setData({
            isAgree: !isAgree,
            isHideAgreement
        });
    },

    showAgreement() {
        const that = this;
        that.setData({
            isHideAgreement: false
        });
    },

    agreementConfirm() {
        const that = this;
        that.setData({
            isHideAgreement: true
        });
    }
})