function getPath(url, params) {
    let path = `/pages/${url}/${url}`;
    if (params) {
        path += '?';
        for (let key in params) {
            // key 是第一个参数时不需要 &
            if (Object.keys(params).indexOf(key) === 0) path += `${key}=${params[key]}`;
            else path += `&${key}=${params[key]}`;
        }
    }
    return path;
}

function skip(url, params, mode) {
    return new Promise((resolve, reject) => {
        let path = getPath(url, params);
        wx[mode]({
            url: path,
            success: res => {
                resolve(res);
            },
            fail: res => {
                reject(res);
            },
        });
    });
}

const navigateTo = (url, params) => skip(url, params, 'navigateTo');

const redirectTo = (url, params) => skip(url, params, 'redirectTo');

const reLaunch = (url, params) => skip(url, params, 'reLaunch');

const navigateBack = delta => {
    return new Promise((resolve, reject) => {
        wx.navigateBack({
            delta: delta,
            success: res => {
                resolve(res);
            },
            fail: res => {
                reject(res);
            },
        });
    });
};

module.exports = {
    navigateTo,
    redirectTo,
    navigateBack,
    reLaunch,
};
