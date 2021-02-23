/*
 * @Description: 购物车组件
 * @Author: 陈俊任
 * @Date: 2021-02-19 23:54:31
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-02-23 14:08:01
 * @FilePath: \tastygo\miniprogram\components\shopping-cart\shopping-cart.js
 */

Component({
    properties: {
        orderData: {
            type: Array,
            value: []
        },
        url: {
            type: String,
            value: ''
        },
        totalPrice: {
            type: Number,
            value: 0,
        },
        totalNum: {
            type: Number,
            value: 0,
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        isHideDetail: true
    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleShowDetail() {
            const that = this;
            const { isHideDetail } = that.data;
            // that._createAnimation();
            if (that.properties.totalNum) {
                that.setData({
                    isHideDetail: !isHideDetail
                });
            }
        },

        editNum(e) {
            const that = this;
            const { id, num } = e.currentTarget.dataset;
            if (that.properties.totalNum + num === 0) {
                that.setData({
                    isHideDetail: true
                });
            }
            that.triggerEvent('itemNumChange', { id, num });
        },

        goToSubmit() {
            const that = this;
            wx.switchTab({
                url: that.properties.url
            });
        },

        _createAnimation() {
            const that = this;
            let slideTopAni = wx.createAnimation({
                duration: 500,
                timingFunction: 'linear',
                delay: 0,
                transformOrigin: '50% 50% 0'
            });

            slideTopAni.height(that.properties.totalNum * 81 + 30).step();

            let slideBottomAni = wx.createAnimation({
                duration: 2000,
                timingFunction: 'linear',
                delay: 0,
                transformOrigin: '50% 50% 0'
            });
            slideBottomAni.height(0).step();
            that.setData({
                slideTopAni: slideTopAni.export(),
                slideBottomAni: slideBottomAni.export()
            })
        }
    },

    pageLifetimes: {
        show: function() {
            // 页面被展示
        },
        hide: function() {
            // 页面被隐藏
        },
        resize: function(size) {
            // 页面尺寸变化
        }
    },

    lifetimes: {
        attached: function() {},
        detached: function() {},
    },
})