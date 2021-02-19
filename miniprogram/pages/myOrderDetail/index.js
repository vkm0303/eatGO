/*
 * @Description: 
 * @Author: 陈俊任
 * @Date: 2021-02-13 14:23:30
 * @LastEditors: 陈俊任
 * @LastEditTime: 2021-02-16 00:40:22
 * @FilePath: \tastygo\miniprogram\pages\myOrderDetail\index.js
 */

var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
    data: {
        getWay: ''
    },
    onLoad: function(options) {
        const that = this;

        qqmapsdk = new QQMapWX({
            key: 'DFJBZ-NRAKU-TVBVU-BQCDA-KZVIE-MSFNQ'
        });
        //let latitude1, latitude2, longitude1, longitude2;
        qqmapsdk.search({
            keyword: '深圳技术大学北区食堂',
            region: '深圳市',
            success: (res) => {
                // console.log(res)
                let latitude = res.data[3].location.lat;
                let longitude = res.data[3].location.lng;
                qqmapsdk.search({
                    keyword: '深圳技术大学学生公寓17B栋',
                    region: '深圳市',
                    complete: (res2) => {
                        console.log(res2)
                        qqmapsdk.calculateDistance({
                            mode: 'walking',
                            from: {
                                latitude: res.data[3].location.lat,
                                longitude: res.data[3].location.lng,
                            },
                            to: [{
                                latitude: res2.data[0].location.lat,
                                longitude: res2.data[0].location.lng,
                            }],
                            complete: (res3) => {
                                console.log(res3)
                            }
                        })
                    }
                });
                let markers = [{
                    latitude,
                    longitude,
                    iconPath: '../../images/logo.png',
                    width: 30,
                    height: 30,
                }];
                that.setData({
                    latitude,
                    longitude,
                    markers
                })
            }
        });

        // qqmapsdk.search({
        //     keyword: '深圳技术大学北区宿舍17B',
        //     region: '深圳市',
        //     success: (res) => {
        //         console.log(res)
        //         latitude2 = res.data[0].location.lat;
        //         longitude2 = res.data[0].location.lng;
        //         let markers = [{
        //                 latitude1,
        //                 longitude1,
        //                 iconPath: '../../images/logo.png',
        //                 width: 30,
        //                 height: 30,
        //             },
        //             {
        //                 latitude2,
        //                 longitude2,
        //                 iconPath: '../../images/logo.png',
        //                 width: 30,
        //                 height: 30,
        //             },
        //         ];
        //         that.setData({
        //             // markers,
        //         })
        //     }
        // });


        that.setData({
            getWay: 'bydelivery'
        });
    },

    onShow: function() {}
})