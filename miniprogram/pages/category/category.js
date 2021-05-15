// pages/category/category.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    isClear: false,
    sort: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id=options.id
    this.setData({
      sort:id
    })
    console.log(id)
    let that = this;
    wx.cloud.database().collection('second_hand')
    .where({
      isDelete: false,
      sort: id
    })
    .limit(10)
      .orderBy('createTime', 'desc') //按发布动态排序
      .get({
        success(res) {
          console.log("请求成功", res)
          var List = res.data
          var count = 0;
          for(var i=0; i<List.length;i++)
          {
            console.log(List[i].isDelete)
            if(List[i].isDelete == true)
            {
              count++;
            }
          }
          if(count==List.length){
            that.data.isClear = true
          }
          that.setData({
            dataList: List,
            isClear : that.data.isClear
          })
          console.log(that.data.dataList)
        },
        fail(res) {
          console.log("请求失败", res)
        }
      })
  },
  toGoods: function (e) {
    var userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.showModal({
        title: '您还未登录',
        content: '是否马上登录?',
        confirmText: '去登录',
        success: (result) => {
          if (result.confirm) {
            wx.navigateTo({
              url: '/pages/login/index'
            });
          }
        }
      });
    } else {
      console.log(e.currentTarget.dataset.id)
      wx.navigateTo({
        url: '../goodsDetail/goodsDetail?id=' + e.currentTarget.dataset.id,
      })
    }
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
    var that = this;
    var temp = [];
    // 获取后面十条
    wx.cloud.database().collection('second_hand')
    .where({
      isDelete: false,
      sort:that.data.sort
    })
      .orderBy('createTime', 'desc')
      .skip(that.data.dataList.length)
      .limit(10)
      .get({
        success: function (res) {
          // res.data 是包含以上定义的两条记录的数组
          if (res.data.length > 0) {
            for (var i = 0; i < res.data.length; i++) {
              var tempTopic = res.data[i];
              temp.push(tempTopic);
            }
            var totalTopic = {};
            totalTopic = that.data.dataList.concat(temp);
            that.setData({
              dataList: totalTopic,
            });
            wx.showToast({
              title: '加载成功',
              icon: "none",
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '已经到底啦~',
              icon: 'none',
              duration: 2000
            })
          }
        },
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})