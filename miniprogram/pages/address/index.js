Page({
    data: {
        isHaveAddress: false
    },
    onShow: function() {
        //接收地址列表数据
        let addressList = wx.getStorageSync("addressList")
        if (addressList) {
            this.setData({
                addressList,
                isHaveAddress: true
            })
        } else
            this.setData({ isHaveAddress: false })
    },
    handleSelectAddress(e) {
        let app = getApp()
        app.globalData.currentAddress = e.currentTarget.dataset.address
        wx.navigateBack({ delta: 1 })
    }
})