// pages/goodsDetail/goodsDetail.js
var that;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataDetail: {},
    comment: [], //留言
    content: '',
    id: '',
    userID:'',
    isAnonymous: false,
    input_bottom:0
  },
  // 获取到焦点
  focus: function (e) {
    let that = this
      this.setData({
        input_bottom: that.data. input_bottom
      })
  },
 
  // 失去焦点
  no_focus: function (e) {
      this.setData({
        input_bottom: 0
      })
  },

  previewImg(e) {
    let imgData = e.currentTarget.dataset.img;
    wx.previewImage({
      current: imgData[0],
      urls: this.data.dataDetail.fileIDs
    })
  },
  //获取评论内容
  getComment(e) {
    this.setData({
      content: e.detail.value
    })
  },
  sendComment(e) {
    let that = this;
    var array
    var date = new Date();
    var month = date.getMonth() + 1;
    var now = month + "-" + (date.getDate()<10? "0"+date.getDate():date.getDate()) + " " + (date.getHours()<10? "0"+date.getHours(): date.getHours()) + ":" + (date.getMinutes()<10? "0"+date.getMinutes():date.getMinutes()); //得到此时的时间
    var id = wx.getStorageSync('userInfo').realName + "(" + wx.getStorageSync('userInfo').campusId + ")";
    console.log(id)
    var userAvatarUrl =  wx.getStorageSync('userInfo').avatar;
    var nickname =  wx.getStorageSync('userInfo').nickname;
     wx.showModal({
      title: '是否匿名评论？',
      content: '',
      cancelText: '否',
      confirmText: '是',
      success: res => {
        if (res.confirm) {
          this.setData({
            isAnonymous: true
          })
        }else{
          this.setData({
            isAnonymous: false
          })
        }
        array = {
          id: id,
          content: that.data.content,
          time: now,
          isAnonymous: that.data.isAnonymous,
          userAvatarUrl: userAvatarUrl,
          nickname : nickname
        };
        let newArray = that.data.dataDetail.comments;
        newArray = newArray.concat(array);
        wx.cloud.database().collection('second_hand').doc(that.data.dataDetail._id).update({
          data: {
            comments: newArray
          },
          success: res => {
            that.data.comment = '';
            that.setData({
              comment: ''
            });
            wx.showToast({
              title: '评论成功,长按可删除',
              icon: 'none',
              duration: 2000,
            });
            that.onShow();
          },
          fail: err => {
            console.error('评论失败', err)
            wx.showToast({
              title: '评论失败，重试看看',
              icon: 'none',
              duration: 1000,
            });
          }
        })
      },
      fail: err => {
        console.error('评论失败', err)
        wx.showToast({
          title: '评论失败，重试看看',
          icon: 'none',
          duration: 1000,
        });
      }
    })
  },
  //点击下载后复制下载链接
  copyUserNumber: function (event) {
    console.log(event)
    wx.setClipboardData({
      data: this.data.dataDetail.userNumber,
      success: res => {
        console.log("复制成功", res)
        wx.showToast({
          title: '已复制微信号or手机号',
          icon: 'none',
          duration: 2500,
        })
      },
      fail: res => {
        console.log("复制失败", res)
      }
    })
  },
  getDataDetail() {
    wx.cloud.database().collection('second_hand')
      .doc(that.data.id)
      .get({
        success(res) {
          console.log("请求成功", res)
          that.setData({
            dataDetail: res.data
          })
        },
        fail(res) {
          console.log("请求失败", res)
        }
      }),
      wx.getUserInfo({
        success: function (res) {
          console.log(res);
          var avatarUrl = 'userInfo.avatarUrl';
          var nickName = 'userInfo.nickName';
          that.setData({
            [avatarUrl]: res.userInfo.avatarUrl,
            [nickName]: res.userInfo.nickName,
          })
        }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.data.id = options.id
    wx.onKeyboardHeightChange(res => {
      that.data.input_bottom = res.height
    })
    var id = wx.getStorageSync('userInfo').realName + "(" + wx.getStorageSync('userInfo').campusId + ")";
    that.data.userID = id
  },
  longPress: function (event) {
    console.log("长按删除",event)
    var that = this;
    var index = event.currentTarget.dataset.index;
    console.log(that.data.userID)
    console.log(that.data.dataDetail.comments[index].id)
    if(that.data.userID == that.data.dataDetail.comments[index].id)
    {
      console.log("是本用户")
      wx.showModal({
        title: '提示信息',
        content: '是否删除这条评论',
        showCancel: true,
        confirmText: '确定',
        success: function (res) {
          if (res.confirm) {
            that.data.dataDetail.comments.splice(index,1)
            wx.cloud.database().collection('second_hand').doc(that.data.dataDetail._id).update({
              data: {
                comments: that.data.dataDetail.comments
              },
              success: res => {
                wx.showToast({
                  title: '删除成功',
                  icon: 'none',
                  duration: 1000,
                });
                that.onShow();
              },
              fail: err => {
                console.error('删除失败', err)
                wx.showToast({
                  title: '删除失败，重试看看',
                  icon: 'none',
                  duration: 1000,
                });
              }
            })
          } else if (res.cancel) {}
        }
      })
    }else{
      console.log("不是发评论的用户")
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
    that.getDataDetail();
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