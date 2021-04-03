// pages/secondhand/secondhand.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    catesList: [
      {
        index: 0,
        name: "学习用品",
        image_src: "../../images/1.png",
        open_type: "switchTab",
        navigator_url: "/pages/category/index"
      },
      {
        index: 1,
       name: "数码产品",
       image_src: "../../images/2.png",
       open_type: "",
       navigator_url: ""
     },
     {
      index: 2,
       name: "服饰箱包",
       image_src: "../../images/3.png",
       open_type: "",
       navigator_url: ""
     },
     {
      index: 3,
       name: "食品日用",
       image_src: "../../images/4.png",
       open_type: "",
       navigator_url: ""
     },
     {
      index: 4,
      name: "运动周边",
      image_src: "../../images/5.png",
      open_type: "",
      navigator_url: ""
    }
    ],
    dataList: []
  },
  qufabu: function(){
    wx.navigateTo({
      url: '../goods_add/goods_add'
    })
  },
  toCategory(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../category/category?id='+e.currentTarget.dataset.id,
    })
  },
  toGoods: function(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail?id='+e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let that = this;
    wx.cloud.database().collection('second_hand')
      .orderBy('createTime', 'desc') //按发布动态排序
      .get({
        success(res) {
          console.log("请求成功", res)
          that.setData({
            dataList: res.data
          })
        },
        fail(res) {
          console.log("请求失败", res)
        }
      })
     
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})