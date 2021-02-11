Page({
    data: {
        isDefault: false,
        index: -1,
        color: '#ff824e'
    },
    onLoad: function(option) {
        if (option.index) {
            let addressList = wx.getStorageSync("addressList")
            this.setData({
                address: addressList[option.index],
                index: option.index,
                isDefault: addressList[option.index].isDefault
            })
        }
    },
    handleSubmit(e) {
        let { value } = e.detail
            //判断信息是否完整
        if (value.name === '' || value.telNum === '' || value.wxAccount === '' || value.address === '' || value.building === '' || value.dormNo === '') {
            wx.showToast({
                title: '信息输入不全',
                icon: 'none'
            })
            return
        }
        let address = e.detail.value
        let { index } = this.data
        let addressList = wx.getStorageSync("addressList") || []
        address.isDefault = this.data.isDefault

        //如果设置默认地址，则更新数组
        if (address.isDefault && addressList.length > 0) {
            for (let i = 0; i < addressList.length; i++) {
                if (addressList[i].isDefault) {
                    addressList[i].isDefault = false
                    break;
                }
            }
        } else if (address.isDefault == 0 && addressList.length <= 1) {
            address.isDefault = true
        }

        //判断入口来源 编辑/添加
        if (index !== -1)
            addressList[index] = address
        else
            addressList.push(address)
        wx.setStorage({
            key: 'addressList',
            data: addressList,
            success: (result) => {
                wx.showToast({
                    title: '保存成功',
                    icon: 'none'
                })
                setTimeout(() => { wx.navigateBack({ delta: 1 }) }, 500);
            },
            fail: () => {
                wx.showToast({
                    title: '保存失败',
                    icon: 'none'
                })
            }
        })
    },
    handleSwitchClick(e) {
        if (e.detail.value) {
            this.setData({
                isDefault: true,
                color: "#ff824e"
            })
        } else {
            this.setData({
                isDefault: false,
                color: "#dad8d8"
            })
        }
    }
})