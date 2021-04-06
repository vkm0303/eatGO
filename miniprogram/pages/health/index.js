Page({
    data: {
        // breakfastList: [1],
        // lunchList: [1],
        // dinnerList: [1, 2],
        // isRepoBtnClick: false,
        // activeOption: '日报告'
        breakfastList:[
            {
                imgFileID : "https://ss3.baidu.com/9fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh=800,450/sign=7e53c1e5870a19d8cb568c0d03caaebf/faf2b2119313b07e786cc85c0bd7912396dd8c95.jpg",
                name: "馒头和草莓酱",
                num: "×1",
                calorie: "150千卡" 
            },
        {
            imgFileID : "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fdpic.tiankong.com%2Fmd%2Fv8%2FQJ6417343691.jpg&refer=http%3A%2F%2Fdpic.tiankong.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620226764&t=e12c672a95021e3ddc5281a279406186",
                name: "牛奶",
                num: "×1",
                calorie: "150千卡" 
        },
        {
            imgFileID : "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn14%2F351%2Fw1195h756%2F20180321%2Fff22-fyskeue1787196.jpg&refer=http%3A%2F%2Fn.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620226785&t=8e58211c432e2d761cea4324ba1de883",
                name: "煮荷包蛋",
                num: "×1",
                calorie: "150千卡" 
        }
    ],
        lunchList: [
                {
                    imgFileID : "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimage.dukuai.com%2Fattachments%2Fday_081209%2F20081209_7bbb2eddc0e054fbbcffbTeVJ3chhhPu.jpg&refer=http%3A%2F%2Fimage.dukuai.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620226813&t=3c8e273d5e9fb2cc08997ea821739d4a",
                    name: "荞麦大米饭",
                    num: "×1",
                    calorie: "200千卡" 
                },
                {
                    imgFileID : "https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20200514%2F6fa9132b33dd4b43ac5951734e5a9459.jpeg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620226833&t=b10c8c4a03b37b8ec3a9b3d414376ff8",
                    name: "香菇菜心",
                    num: "×1",
                    calorie: "100千卡" 
                },
                {
                    imgFileID : "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fmmbiz.qpic.cn%2Fmmbiz_jpg%2FUz7ZiajVoNk8SDqzoeZjxtPnibopB50kllPghTqF4e8ovbRP8VUicKu5AdPPszyJMtkCqfB7OGEomVkK6D3GgWicgA%2F0%3Fwx_fmt%3Djpeg&refer=http%3A%2F%2Fmmbiz.qpic.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620226847&t=d36ba56d45615cee0f55e51a52eb1246",
                    name: "糖醋带鱼",
                    num: "×1",
                    calorie: "300千卡" 
                }

            ],
        dinnerList: [
            {
                imgFileID : "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1218918937,1124255614&fm=26&gp=0.jpg",
                name: "绿豆粥",
                num: "×1",
                calorie: "100千卡" 
            },
            {
                imgFileID : "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi.serengeseba.com%2Fuploads%2Fi_4_3735919156x2254304236_26.jpg&refer=http%3A%2F%2Fi.serengeseba.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620226883&t=d5e5dc6c75e1a50e4e40a8af5826d74c",
                name: "白菜猪肉包子",
                num: "×1",
                calorie: "225千卡" 
            },
            {
                imgFileID : "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fcp1.douguo.com%2Fupload%2Fcaiku%2F4%2F7%2Fb%2Fyuan_47e0db0d795328ad3abac3e46e56856b.jpeg&refer=http%3A%2F%2Fcp1.douguo.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1620226895&t=7a4d7ab87830edc54f6717246b03bd19",
                name: "虾皮冬瓜",
                num: "×1",
                calorie: "200千卡" 
            },
        ]
    },
    onLoad: function(options) {

    },
    // handleRepoBtnClick() {
    //     let aniHeightAdd = wx.createAnimation({
    //         duration: 150,
    //         timingFunction: 'linear',
    //         delay: 0,
    //         transformOrigin: '50% 50% 0'
    //     })
    //     aniHeightAdd.height("180rpx").step()
    //     let aniHeightReduce = wx.createAnimation({
    //         duration: 150,
    //         timingFunction: 'linear',
    //         delay: 0,
    //         transformOrigin: '50% 50% 0'
    //     });
    //     aniHeightReduce.height("52rpx").step()
    //     let { isRepoBtnClick } = this.data
    //     this.setData({
    //         isRepoBtnClick: !isRepoBtnClick,
    //         aniHeightAdd: aniHeightAdd.export(),
    //         aniHeightReduce: aniHeightReduce.export()
    //     })
    // },
    // // handleOptionClick(e) {
    // //     let { option } = e.currentTarget.dataset
    // //     this.setData({ activeOption: option })
    // // }
})