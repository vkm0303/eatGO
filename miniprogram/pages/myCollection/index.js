const app = getApp()
var account = ''
var collections = []
var beiqu_menu
var nanqu_menu
var shijin_menu
var zuyun_menu
var db = wx.cloud.database()
let indexs = []

Page({
    data: {
        isLogin: app.globalData.isLogin
    },
    onLoad: function(options) {
        beiqu_menu = wx.getStorageSync('beiqu_menu')
        nanqu_menu = wx.getStorageSync('nanqu_menu')
        shijin_menu = wx.getStorageSync('shijin_menu')
        zuyun_menu = wx.getStorageSync('zuyun_menu')
    },
    onShow: function() {

        if (app.globalData.isLogin)
            account = app.globalData.userInfo.no
        this.onLoadCollectionList()
    },
    onLoadCollectionList() {
        const that = this
        db.collection('user_collection').where({ account }).get().then(res => {
            console.log(res.data)
            indexs = res.data
            console.log(app.globalData.isLogin)
            collections = []
            for (var i = 0; i < indexs.length; i++) {
                switch (indexs[i].canteen) {
                    case '北区食堂':
                        console.log(beiqu_menu)
                        collections[i] = beiqu_menu[indexs[i].class_index].list[indexs[i].food_index]
                        break
                    case '南区食堂':
                        collections[i] = nanqu_menu[indexs[i].class_index].list[indexs[i].food_index]
                        break
                    case '竹韵食堂':
                        collections[i] = zuyun_menu[indexs[i].class_index].list[indexs[i].food_index]
                        break
                    case '石井食堂':
                        collections[i] = shijin_menu[indexs[i].class_index].list[indexs[i].food_index]
                        break
                }
            }
            console.log(collections)
            that.setData({ collections })
        })
    },
    handleCancelCollect(e) {
        const { index } = e.currentTarget.dataset
        const that = this
        wx.showModal({
            title: '提示',
            content: '是否取消收藏',
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
        }).then(result => {
            if (result.confirm) {
                db.collection('user_collection').doc(indexs[index]._id).remove().then(() => {
                    that.onLoadCollectionList()
                })
            }
        })
    }
})