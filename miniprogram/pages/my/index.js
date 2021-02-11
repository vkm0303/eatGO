Page({
    data: {
        isLogin: false
    },
    onLoad: function(options) {},
    onShow: function() {
        const app = getApp()
        if (app.globalData.isLogin) {
            const userInfo = wx.getStorageSync('userInfo');
            if (userInfo) {
                app.globalData.isLogin = true
                this.setData({
                    headPicUrl: userInfo.avatarUrl,
                    name: userInfo.name,
                    no: userInfo.no,
                    isLogin: true
                })
            }
        } else
            this.setData({ isLogin: false })
    },
    handleLogin(e) {
        wx.navigateTo({
            url: '/pages/login/index'
        })
    }
})