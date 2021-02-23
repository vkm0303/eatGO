/*
 * @Description: 下拉框列表选择器
 * @Author: 陈俊任
 * @Date: 2021-02-12 13:02:53
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-02-23 15:08:37
 * @FilePath: \tastygo\miniprogram\components\drop-selector\index.js
 */
const componentOptions = {
    // 组件选项
    options: {
        multipleSlots: true,
    },
    behaviors: [],
    externalClasses: ['outer-class', 'curitem-class', 'item-class', 'active-class', 'position-class'],
    properties: {
        options: {
            type: Array,
            value: []
        },
        itemHeight: {
            type: Number,
            value: 34
        },
        key: {
            type: Number,
            value: 0
        },
    },

    // 组件数据
    data: {
        isSelectorFold: true,
        curIndex: 0,
    },

    // 组件方法
    methods: {
        handleOptionSelect(e) {
            const that = this;
            const { index } = e.currentTarget.dataset;
            that.triggerEvent('ItemSelect', { index });
            that.setData({
                curIndex: index
            });
        },
        handleSelectorClick() {
            const that = this;
            that._createAnimation(that.properties.options.length);
        },
        _createAnimation(itemsNum) {
            const that = this;
            const { itemHeight } = that.properties;
            //展开下拉框
            let aniHeightAdd = wx.createAnimation({ duration: 150 });
            aniHeightAdd.height(itemsNum * itemHeight + 20).step()

            //箭头逆时针向上转
            let aniArrowUp = wx.createAnimation({ duration: 200 });
            aniArrowUp.rotate(-180).step();

            //收回下拉框
            let aniHeightReduce = wx.createAnimation({ duration: 200 });
            aniHeightReduce.height(itemHeight).step();

            //箭头恢复初始位置
            let aniArrowDown = wx.createAnimation({ duration: 200 });
            aniArrowDown.rotate(0).step();

            let { isSelectorFold } = that.data; //获取下拉框状态

            that.setData({
                isSelectorFold: !isSelectorFold,
                aniHeightAdd: aniHeightAdd.export(),
                aniHeightReduce: aniHeightReduce.export(),
                aniArrowUp: aniArrowUp.export(),
                aniArrowDown: aniArrowDown.export()
            });
        },
    },

    lifetimes: {
        attached: function() {
            // 在组件实例进入页面节点树时执行
            // const that = this;
            // const { key } = that.properties;
            // console.log(that.properties.options)
            // if (key >= 0) {
            //     that.setData({
            //         curOption: that.properties.options[key]
            //     });
            // } else {
            //     that.setData({
            //         curOption: that.properties.options[0]
            //     });
            // }
        },
        detached: function() {
            // 在组件实例被从页面节点树移除时执行
        },
    },

    // 页面生命周期
    pageLifetimes: {
        // 页面被展示
        show() {},
    },
}

Component(componentOptions)