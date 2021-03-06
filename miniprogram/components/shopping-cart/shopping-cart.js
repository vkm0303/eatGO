/*
 * @Description: 购物车组件
 * @Author: 陈俊任
 * @Date: 2021-02-19 23:54:31
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-03-08 10:33:25
 * @FilePath: \tastygo\miniprogram\components\shopping-cart\shopping-cart.js
 */

var oldNum = 0;

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
        isHideDetail: true,
        scrollHeight: '',
    },

    observers: {
        'totalNum': function(newNum) {
            const that = this;
            if (newNum > oldNum) {
                let animation = wx.createAnimation({
                    duration: 200,
                });

                animation.rotate3d(1, 0, 0, 60);
                animation.translateZ(8).step();
                that.setData({
                    addAni: animation.export()
                });
                setTimeout(() => {
                    animation.rotate3d(1, 0, 0, 0).step();
                    that.setData({
                        addAni: animation.export()
                    });
                }, 1100);
            }
            oldNum = newNum;
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleShowDetail() {
            const that = this;
            const { isHideDetail } = that.data;
            // that._createAnimation();
            let scrollHeight = '';
            if (that.properties.totalNum) {
                if (that.properties.orderData.length > 4) {
                    scrollHeight = 'height:640rpx';
                }
                that.setData({
                    isHideDetail: !isHideDetail,
                    scrollHeight
                });
            }
        },

        //清空购物车
        clear() {
            const that = this;
            wx.showModal({
                title: '确定清空购物车吗？',
                success: (result) => {
                    if (result.confirm) {
                        that.triggerEvent('clearCart');
                        that.setData({
                            isHideDetail: true
                        });
                    }
                }
            });

        },

        //编辑商品数量
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
        },

        preventMove() {}
    },

    pageLifetimes: {},

    lifetimes: {
        attached: function() {},
        detached: function() {},
    },
})