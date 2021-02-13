/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-10 23:59:19
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-02-14 01:28:24
 * @FilePath: \tastygo\miniprogram\pages\login\index.js
 */
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
        // wx.showLoading({
        //     title: "验证中",
        //     mask: true
        // })
        const { userInfo } = e.detail
        // wx.cloud.callFunction({
        //     name: 'login',
        //     data: {
        //         account: account,
        //         password: password
        //     }
        // }).then(res => {
        //     console.log(res)
        //     if (res.result.name == "") {
        //         wx.showToast({
        //             title: '登录失败',
        //             icon: 'none'
        //         })
        //         wx.hideLoading()
        //         return
        //     }
        //     userInfo.name = res.result.name
        //     userInfo.no = res.result.no
        //     userInfo.college = res.result.college
        //     userInfo.major = res.result.major
        //     userInfo.class = res.result.class
        //     let app = getApp()
        //     app.globalData.userInfo = userInfo
        //     app.globalData.isLogin = true
        //     wx.setStorageSync('userInfo', userInfo)
        //     wx.setStorageSync('loginState', true);
        //     //wx.hideLoading()
        //     wx.switchTab({ url: '/pages/my/index' })
        // })
        let app = getApp()
        app.globalData.userInfo = userInfo
        app.globalData.isLogin = true
        wx.setStorageSync('userInfo', userInfo)
        wx.setStorageSync('loginState', true);
        wx.switchTab({ url: '/pages/my/index' })
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