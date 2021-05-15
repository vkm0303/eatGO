// pages/secondhand/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userID:'',
    dataList:[],
    isClear: false,
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
    .where({
      id:that.data.userID
    })
    .limit(10)
      .orderBy('createTime', 'desc') //按发布动态排序
      .get({
        success(res) {
          console.log("请求成功", res)
          var List = res.data
          console.log(List)
           //判断是不是被清空了
           if(List.length!=0)
           {
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
           }
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
  qufabu: function(){
    var userInfo = wx.getStorageSync('userInfo');
    if(!userInfo)
    {
      wx.showModal({
        title: '您还未登录',
        content: '是否马上登录?',
        confirmText: '去登录',
        success: (result) => {
            if (result.confirm) {
                wx.navigateTo({ url: '/pages/login/index' });
            }
        }
    });
   }else{
    wx.navigateTo({
      url: '../goods_add/goods_add'
    })
   }
  },
  changeStatus(e){
   var that = this;
   var id = e.currentTarget.dataset.id;
   wx.showActionSheet({
     itemList: ['已卖出', '删除'],
     success(res){
      if (res.tapIndex == 0) {
        //已卖出
        wx.cloud.database().collection('second_hand').doc(id).update({
          data:{
            isSold: true
          },
          success(res){
            console.log("已卖出成功",res)
            that.onLoad();
          },
          fail(res){
            console.log("已卖出失败",res)
          }
        })
      } else if (res.tapIndex == 1) {
        //删除
        wx.showModal({
          title: '提示信息',
          content: '确定要删除该商品吗？',
          confirmText: '确定',
          cancelText: '取消',
          success: function (res) {
            if (res.confirm) {
              wx.cloud.database().collection('second_hand').doc(id).update({
                data:{
                  isDelete : true
                },
                success(res){
                  console.log("删除成功",res)
                  wx.showToast({
                    title: '删除成功',
                    icon: 'none'
                  })
                  that.onLoad();
                },
                fail(res){
                  console.log("删除失败",res)
                }
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
     },
     fail(res){
      console.log(res)
    },

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
    var that = this;
    // wx.showLoading({
    //   title: '加载中',
    //   duration: 2000
    // })
    var temp = [];
    // 获取后面十条
    wx.cloud.database().collection('second_hand')
    .where({
      id:that.data.userID
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