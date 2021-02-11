//index.js
//获取应用实例

wx.cloud.init()
Page({
    data: {
        status: '未登录'
    },
    login(e) {
        const { account, password } = e.detail.value
        wx.cloud.callFunction({
            name: 'login',
            data: {
                account: account,
                password: password
            }
        }).then(res => {
            console.log(res.result)
            this.setData({
                name: res.result.name,
                no: res.result.no,
                college: res.result.college,
                major: res.result.major,
                class: res.result.class,
                status: '已登录'
            })
        })
    },
    onLoad: async function() {

        let Cookie = 'JSESSIONID=AE8517DBA8820D5849C040266D83BE9C;'
            //onSubmint()
        var strUrl = "https://isea.sztu.edu.cn/Logon.do?method=logon&flag=sess";
        var encoded = "";
        /*let request = wx.request({
            url: strUrl,
            method: "POST",
            cache: false,
            header: { 'content-type': 'application/json' },
            dataType: 'json',
            responseType: 'text',
            success: function(dataStr) {
                Cookie = dataStr.cookies[0].substr(0, 44)
                    //console.log(dataStr)
                if (dataStr == "no") {
                    return false;
                } else {
                    var scode = dataStr.data.split("#")[0];
                    var sxh = dataStr.data.split("#")[1];
                    var code = '201903010108' + "%%%" + 'A13126034811';
                    for (var i = 0; i < code.length; i++) {
                        if (i < 20) {
                            encoded = encoded + code.substring(i, i + 1) + scode.substring(0, parseInt(sxh.substring(i, i + 1)));
                            scode = scode.substring(parseInt(sxh.substring(i, i + 1)), scode.length);
                        } else {
                            encoded = encoded + code.substring(i, code.length);
                            i = code.length;
                        }
                    }
                    //console.log(encoded)
                }
                let request2 = wx.request({
                    url: 'https://isea.sztu.edu.cn/Logon.do?method=logon',
                    data: {
                        'view': '1',
                        'useDogCode': '',
                        'encoded': encoded
                    },
                    header: {
                        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/
        /*;q=0.8,application/signed-exchange;v=b3",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept-Language": "zh-CN,zh;q=0.9",
                            'Connection': 'keep-alive',
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Cookie': Cookie,
                            'Host': 'isea.sztu.edu.cn',
                            "Upgrade-Insecure-Requests": "1"
                        },
                        method: 'POST',
                        dataType: 'json',
                        responseType: 'text',
                        success: (result) => {
                            //console.log(result.header["Set-Cookie"])
                            let Cookie2 = result.header["Set-Cookie"].substr(0, 44)
                            let request3 = wx.request({
                                url: 'https://isea.sztu.edu.cn/jsxsd/framework/xsMain.jsp',
                                header: {
                                    'content-type': 'application/json',
                                    'Connection': 'keep-alive',
                                    'Host': 'isea.sztu.edu.cn',
                                    'Cookie': 'JSESSIONID=9B91D477FDAC6F63E5E1B47224AD7B53;' //'JSESSIONID=89B8FE0E575F72874DCF7E04899218FE;'
                                },
                                method: 'GET',
                                dataType: 'json',
                                responseType: 'text',
                                success: (result) => {
                                    //console.log(result)
                                }
                            })
                        }
                    })
                }

            })*/
    },

    submitForm1() {
        var xh = '201903010108'
        var pwd = 'A13126034811'
        if (xh == "") {
            return false;
        }
        if (pwd == "") {
            return false;
        }
        var account = this.encodeInp(xh);
        var passwd = this.encodeInp(pwd);
        var encoded = account + "%%%" + passwd;
        return encoded;
    },
    encodeInp(input) {
        var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;
        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64
            } else if (isNaN(chr3)) {
                enc4 = 64
            }
            output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = ""
        } while (i < input.length);
        return output
    },
})