function request(url, data, method) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: url,
            data: data,
            method: method,
            header: {
                'content-type': 'application/json',
            },
            success: res => {
                if (res.statusCode === 200) {
                    if (res.data.code === 200) {
                        resolve(res.data);
                    } else {
                        reject();
                        console.log('=== 数据返回异常 ===');
                    }
                } else {
                    reject(res.errMsg);
                }
            },
            fail: res => {
                reject(res);
                console.log('=== 请求异常 ===');
            },
        });
    });
}

const post = (url, data = {}) => request(url, data, 'POST');
const get = (url, data = {}) => request(url, data, 'GET');

module.exports = {
    post,
    get,
};
