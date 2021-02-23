Page({
    data: {
        tabs: [],
        activeTab: 0,
        currentWeek: 7,
        week: ["第一周", "第二周", "第三周", "第四周", "第五周", "第六周", "第七周", "第八周", "第九周", "第十周", "第十一周", "第十二周", "第十三周", "第十四周", "第十五周", "第十六周", "第十七周", "第十八周", "第十九周", "第二十周"]
    },

    onLoad() {
        const titles = ['北区食堂', '石井食堂', '竹韵食堂', '北区西餐厅', '南区食堂']
        const tabs = titles.map(item => ({ title: item }))
        this.setData({ tabs })
    },

    onReady: function() {
        let cvsCtx = wx.createCanvasContext('numChart')
        let i = 0
        let x = 25
        let topY = [60, 90, 50, 120, 80, 150, 140]
        this.creatCanvasGrd(cvsCtx, 25, 60, 25, 240, 27, 190)
        this.creatCanvasGrd(cvsCtx, 75, 90, 75, 240, 27, 160)
        this.creatCanvasGrd(cvsCtx, 125, 50, 125, 240, 27, 200)
        this.creatCanvasGrd(cvsCtx, 175, 120, 175, 240, 27, 130)
        this.creatCanvasGrd(cvsCtx, 225, 80, 225, 240, 27, 170)
        this.creatCanvasGrd(cvsCtx, 275, 150, 275, 240, 27, 100)
        this.creatCanvasGrd(cvsCtx, 325, 140, 325, 240, 27, 110)
        let date = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        for (i = 0, x = 26; i < 7; i++, x += 50) this.creatCanvasFillText(cvsCtx, x, 265, date[i])
        this.creatCanvasLine(cvsCtx, 38, 62, 88, 92)
        this.creatCanvasLine(cvsCtx, 88, 92, 138, 52)
        this.creatCanvasLine(cvsCtx, 138, 52, 188, 122)
        this.creatCanvasLine(cvsCtx, 188, 122, 238, 82)
        this.creatCanvasLine(cvsCtx, 238, 82, 288, 152)
        this.creatCanvasLine(cvsCtx, 288, 152, 338, 142)
        let time = ["12:10", "12:16", "12:13", "12:11", "12:07", "12:09", "12:16"]
        for (i = 0, x = 23; i < 7; i++, x += 50) this.creatCanvasFillText(cvsCtx, x, topY[i] - 20, time[i])
        let peopleNum = [198, 170, 187, 136, 180, 120, 130]
        for (i = 0, x = 28; i < 7; i++, x += 50) this.creatCanvasFillText(cvsCtx, x, topY[i] - 5, peopleNum[i])
        cvsCtx.draw()
    },

    creatCanvasGrd(cvsCtx, x1, y1, x2, y2, weight, height) {
        let grd = cvsCtx.createLinearGradient(x1, y1, x2, y2)
        grd.addColorStop(0, "#ffffff")
        grd.addColorStop(1, "#2cade3")
        cvsCtx.fillStyle = grd
        cvsCtx.fillRect(x1, y1, weight, height)
    },
    creatCanvasFillText(cvsCtx, x, y, textVal) {
        cvsCtx.setFontSize(12)
        cvsCtx.setFillStyle("#dbdbdb")
        cvsCtx.fillText(textVal, x, y)
    },
    creatCanvasLine(cvsCtx, x, y, x1, y1) {
        cvsCtx.beginPath()
        cvsCtx.moveTo(x, y)
        cvsCtx.lineTo(x1, y1)
        cvsCtx.strokeStyle = "#86cadf"
        cvsCtx.stroke()
    },

    onTabCLick(e) {
        const index = e.detail.index
        this.setData({ activeTab: index })
    },

    onChange(e) {
        const index = e.detail.index
        this.setData({ activeTab: index })
    },

    handleSwitchPreWeek() {
        let { currentWeek } = this.data
        if (currentWeek > 0) {
            currentWeek--;
            this.setData({ currentWeek })
        }
    },

    handleSwitchNextWeek() {
        let { currentWeek } = this.data
        if (currentWeek < 19) {
            currentWeek++;
            this.setData({ currentWeek })
        }
    }
})