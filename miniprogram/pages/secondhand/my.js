// pages/secondhand/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userID:'',
    dataList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    var userid = wx.getStorageSync('userInfo').realName + "(" + wx.getStorageSync('userInfo').campusId + ")";
    that.data.userID = userid
    console.log(that.data.userID)
    wx.cloud.database().collection('second_hand')
      .orderBy('createTime', 'desc') //按发布动态排序
      .get({
        success(res) {
          console.log("请求成功", res)
          var List = res.data
          console.log(1)
          List=List.filter(item=>item.id==that.data.userID)
          console.log(List)
          that.setData({
            dataList: List
          })
        },
        fail(res) {
          console.log("请求失败", res)
        }
      })
  },
  toGoods: function(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../goodsDetail/goodsDetail?id='+e.currentTarget.dataset.id,
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