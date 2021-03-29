// 云函数入口文件
var request = require('request-promise');
request = request.defaults({ jar: true });
const cloud = require('wx-server-sdk');
cloud.init({ env: 'test-v14h8' });
var userInfo = { name: '', no: '' };

// 云函数入口函数
exports.main = async(event, context) => {
    // const { account, password } = event
    const account = '201903010108';
    const password = 'A13126034811';
    let cookie = ''
    var encoded = ""
    var requestData = ""
    var postOption1 = {
        url: "https://isea.sztu.edu.cn/Logon.do?method=logon&flag=sess",
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(requestData)
    }
    try {
        await request(postOption1, (e,res,body)=>{
            cookie=res.headers['set-cookie'][0].substr(0,43)
        }).then(dataStr => {
            if (dataStr == "no") {
                return false;
            } else {
                var scode = dataStr.split("#")[0]
                var sxh = dataStr.split("#")[1]
                var code = account + "%%%" + password
                for (var i = 0; i < code.length; i++) {
                    if (i < 20) {
                        encoded = encoded + code.substring(i, i + 1) + scode.substring(0, parseInt(sxh.substring(i, i + 1)))
                        scode = scode.substring(parseInt(sxh.substring(i, i + 1)), scode.length)
                    } else {
                        encoded = encoded + code.substring(i, code.length)
                        i = code.length
                    }
                }
            }
        })
    } catch (e) {}
    console.log(encoded);
    if (encoded == "")
        return userInfo
            //封装请求头
    var getOption = {
        url: '',
        method: "GET",
        json: true,
        headers: {
            "content-type": "application/json",
        }
    }
    var postOption2 = {
        url: 'http://isea.sztu.edu.cn/Logon.do?method=logon',
        method: "POST",
        json: true,
        followAllRedirects: true,
        headers: {
            //"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            //"Accept-Encoding": "gzip, deflate",
            //"Accept-Language": "zh-CN,zh;q=0.9",
            //"Cache-Control": "max-age=0",
            //"Content-Length": "47",
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": cookie,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'zh-CN,zh;q=0.9',
            'Cache-Control': 'max-age=0',
            'Connection': 'keep-alive',
            'Host': 'jwgl.sdust.edu.cn',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36'
        },
        form: {
            'view': '1',
            'useDogCode': '',
            'encoded': encoded
        }
    }
    const reg = new RegExp(/[^\u4e00-\u9fa5|,]+/, 'g')
    try {
        //请求https://isea.sztu.edu.cn/Logon.do?method=logon
        console.log(0)
        await request(postOption2, (err, response, body) => {
            console.log(response)
                //用于302会自动重定向，因此需要在这里截取数据
            if (response.statusCode === 302) {
                console.log(2)
                getOption.url = response.headers.location
            }
        })

    } catch (e) {}
    // try {
    //     await request(getOption, (err, response, body) => {
    //         const nameIdx = body.indexOf('姓')
    //         const noIdx = body.indexOf('号')
    //         userInfo.name = body.substring(nameIdx + 3, nameIdx + 7).replace(reg, '')
    //        // userInfo.no = body.substring(noIdx + 2, noIdx + 14).match(/^[1-9]\d*|0$/, '')[0]
    //     })

    // } catch (e) {}
    // try {
    //     console.log(5)
    //     getOption.url = "https://isea.sztu.edu.cn/jsxsd/grxx/xsxx"
    //     await request(getOption, (err, response, body) => {
    //         const collegeIdx = body.indexOf('院')
    //         const majorIdx = body.indexOf("专")
    //         const classIdx = body.indexOf('班')
    //         userInfo.college = body.substring(collegeIdx + 2, collegeIdx + 20).replace(reg, '')
    //         userInfo.major = body.substring(majorIdx + 3, majorIdx + 20).replace(reg, '')
    //         userInfo.class = body.substring(classIdx + 3, classIdx + 20).replace(/[^\u4e00-\u9fa5|0-9,]+/g, '')
    //     })
    //     console.log(userInfo)
    //     return userInfo
    // } catch (e) {} finally {
    //     return userInfo
    // }

}