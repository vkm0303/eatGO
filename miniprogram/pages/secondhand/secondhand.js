// pages/secondhand/secondhand.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    catesList: [
      {
        name: "学习用品",
        image_src: "../../images/1.png",
        open_type: "switchTab",
        navigator_url: "/pages/category/index"
      },
      {
       name: "数码产品",
       image_src: "../../images/2.png",
       open_type: "",
       navigator_url: ""
     },
     {
       name: "服饰箱包",
       image_src: "../../images/3.png",
       open_type: "",
       navigator_url: ""
     },
     {
       name: "食品日用",
       image_src: "../../images/4.png",
       open_type: "",
       navigator_url: ""
     },
     {
      name: "运动周边",
      image_src: "../../images/5.png",
      open_type: "",
      navigator_url: ""
    }
    ]
  },
  qufabu: function(){
    wx.navigateTo({
      url: '../goods_add/goods_add'
    })
  },
  toGoods: function(){
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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