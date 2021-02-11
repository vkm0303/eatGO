// pages/accountManage/index.js
Page({
    data: {

    },
    onLoad: function(options) {
        const app = getApp()
        if (app.globalData.isLogin) {
            const { userInfo } = app.globalData
            this.setData({
                name: userInfo.name,
                no: userInfo.no,
                headPicUrl: userInfo.avatarUrl,
                isLogin: true
            })
        }
    },
    exitLoginState() {
        const app = getApp()
        app.globalData.isLogin = false
        wx.setStorageSync('loginState', false)
        this.setData({ isLogin: false })
    }
})