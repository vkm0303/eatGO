let app = getApp();
Page({
  data: {
    imgList: [],
    fileIDs: [],
    desc: '',
    goodName: '',
    goodPrice: '',
    degree:'全新',
    sort: 0,
    avatarUrl:'',
    nickName:'',
    userNumber:'',
    picker: ['学习用品', '数码产品', '服饰箱包', '食品日用', '运动周边']
  },
  onLoad: function(options) {
    let that = this;
    
    that.getUserInfo();
  },
  getUserInfo(){
    let that = this
    wx.getUserInfo({
      success: function (res) {
        console.log("获取用户信息成功",res);
        var avatarUrl = 'userInfo.avatarUrl';
        var nickName = 'userInfo.nickName';
        that.setData({
          avatarUrl: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName,
        })
      },
      fail: function (res) {
        console.log("获取用户信息失败",res);
      }
    })
  },
  //获得商品分类
  PickerChangeA(e) {
    this.setData({
      sort: e.detail.value
    })
  },
  //获取商品名字
  getgoodName(event) {
    this.setData({
      goodName: event.detail.value
    })
  },
  //获取商品价格
  getgoodPrice(event) {
    this.setData({
      goodPrice: event.detail.value
    })
  },
  //获取商品新旧程度
  getdegree(event) {
    this.setData({
      degree: event.detail.value
    })
  },
  //获取联系方式
  getNumber(event){
    this.setData({
      userNumber: event.detail.value
    })
  },
  //获取商品描述信息
  getDesc(event) {
    this.setData({
      desc: event.detail.value
    })
  },
  


  //选择图片
  ChooseImage() {
    wx.chooseImage({
      count: 4 - this.data.imgList.length, //默认4
      sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        console.log("选择图片成功", res)
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
        console.log("路径", this.data.imgList)
      }
    });
  },
  //获取当前时间,返回时间格式：2019-05-23 15:43:36
  getNowFormatDate: function () {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
     month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
     strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
     " " + date.getHours() + seperator2 + date.getMinutes() +
     seperator2 + date.getSeconds();
    return currentdate;
   },
  //删除图片
  DeleteImg(e) {
    wx.showModal({
      title: '要删除这张照片吗？',
      content: '',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  

  //上传数据
  publish() {
    let desc = this.data.desc
    let imgList = this.data.imgList
    let goodName = this.data.goodName
    let goodPrice = this.data.goodPrice
    let degree = this.data.degree
    let sort = this.data.sort
    let userNumber = this.data.userNumber
    let id = wx.getStorageSync('userInfo').realname + "(" + wx.getStorageSync('userInfo').no + ")";
    if (this.data.goodName == '') {
      wx.showToast({
        icon: 'none',
        title: '请填写商品名称',
      })
    }  else if (this.data.goodPrice == '') {
      wx.showToast({
        icon: 'none',
        title: '请填写商品价格',
      })
    } else if (this.data.userNumber == '') {
      wx.showToast({
        icon: 'none',
        title: '请填写您的联系方式',
      })
    } else if (this.data.desc == '') {
      wx.showToast({
        icon: 'none',
        title: '请填写商品描述',
      })
    }  else if (this.data.imgList.length == 0) {
      wx.showToast({
        icon: 'none',
        title: '请选择商品图片',
      })
    } else {

   
    wx.getUserInfo({
      success: function (res) {
        console.log("获取用户信息成功",res);
        var avatarUrl = 'userInfo.avatarUrl';
        var nickName = 'userInfo.nickName';
        that.setData({
          avatarUrl: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName,
        })
      },
      fail: function (res) {
        console.log("获取用户信息失败",res);
      }
    })
    wx.showLoading({
      title: '发布中...',
    })
   
    const promiseArr = []
    //只能一张张上传 遍历临时的图片数组
    for (let i = 0; i < this.data.imgList.length; i++) {
      let filePath = this.data.imgList[i]
      let suffix = /\.[^\.]+$/.exec(filePath)[0]; // 正则表达式，获取文件扩展名
      //在每次上传的时候，就往promiseArr里存一个promise，只有当所有的都返回结果时，才可以继续往下执行
      promiseArr.push(new Promise((reslove, reject) => {
        wx.cloud.uploadFile({
          cloudPath: 'secondHandPhotos/'+ new Date().getTime() + suffix,
          filePath: filePath, // 文件路径
        }).then(res => {
          // get resource ID
          console.log("上传结果", res.fileID)
          this.setData({
            fileIDs: this.data.fileIDs.concat(res.fileID)
          })
          reslove()
        }).catch(error => {
          console.log("上传失败", error)
        })
      }))
    }
    //保证所有图片都上传成功
    let that=this;    
    Promise.all(promiseArr).then(res => {
      wx.cloud.database().collection('second_hand').add({
        data: {
          fileIDs: this.data.fileIDs,        
          createTime:that.getNowFormatDate(),
          desc: this.data.desc,
          images: this.data.imgList,
          goodName: this.data.goodName,
          goodPrice: this.data.goodPrice,
          degree: this.data.degree,
          sort: this.data.sort,
          userNumber : this.data.userNumber,
          avatarUrl: this.data.avatarUrl,
          nickName: this.data.nickName,
          comments:[],
          id: id,
          isDelete: false,
          isSold: false
        },
        success: res => {
          wx.hideLoading()
          wx.showToast({
            title: '发布成功',
          })
          console.log('发布成功', res)
           wx.navigateTo({
           url: '../secondhand/secondhand',
          })
        },
        fail: err => {
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '网络不给力....'
          })
          console.error('发布失败', err)
        }
      })
    })
  }
  },
})