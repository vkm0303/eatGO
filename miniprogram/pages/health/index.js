Page({
    data: {
        breakfastList: [1],
        lunchList: [1],
        dinnerList: [1, 2],
        isRepoBtnClick: false,
        activeOption: '日报告'
    },
    onLoad: function(options) {

    },
    handleRepoBtnClick() {
        let aniHeightAdd = wx.createAnimation({
            duration: 150,
            timingFunction: 'linear',
            delay: 0,
            transformOrigin: '50% 50% 0'
        })
        aniHeightAdd.height("180rpx").step()
        let aniHeightReduce = wx.createAnimation({
            duration: 150,
            timingFunction: 'linear',
            delay: 0,
            transformOrigin: '50% 50% 0'
        });
        aniHeightReduce.height("52rpx").step()
        let { isRepoBtnClick } = this.data
        this.setData({
            isRepoBtnClick: !isRepoBtnClick,
            aniHeightAdd: aniHeightAdd.export(),
            aniHeightReduce: aniHeightReduce.export()
        })
    },
    handleOptionClick(e) {
        let { option } = e.currentTarget.dataset
        this.setData({ activeOption: option })
    }
})