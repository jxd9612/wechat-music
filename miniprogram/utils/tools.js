// 简单判断 数组/json 是否为空
const isEmpty = arg => (JSON.stringify(arg) == '[]' || JSON.stringify(arg) == '{}' || !arg ? true : false);

// 防抖
const debounce = (func, wait, immediate) => {
    let timeout, result;
    let debounced = function () {
        let context = this;
        let args = arguments;
        if (timeout) clearTimeout(timeout);
        if (immediate) {
            let callNow = !timeout;
            timeout = setTimeout(() => {
                timeout = null;
            }, wait);
            if (callNow) result = func.apply(context, args);
        } else {
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        }
        return result;
    };
    debounced.cancel = () => {
        clearTimeout(timeout);
        timeout = null;
    };
    return debounced;
};

// 节流
const throttle = (func, wait) => {
    let previous = 0;
    return function () {
        let now = +new Date();
        let context = this;
        let args = arguments;
        if (now - previous > wait) {
            func.apply(context, args);
            previous = now;
        }
    };
};

// 分页
const getPagingData = (page = 1, pageSize = 20, totalData = []) => {
    const { length } = totalData;
    const pagingData = {
        data: [],
        page,
        pageSize,
        length,
    };
    if (pageSize >= length) {
        pagingData.data = totalData;
        pagingData.page = 1;
    } else {
        const num = pageSize * (page - 1);
        if (num < length) {
            const startIndex = num;
            const endIndex = num + pageSize - 1;
            //当前页数据条数小于每页最大条数时，也按最大条数范围筛取数据
            pagingData.data = totalData.filter((_, index) => index >= startIndex && index <= endIndex);
        } else {
            //当前页码超出最大页码，则计算实际最后一页的page，自动返回最后一页数据
            const size = parseInt(length / pageSize);
            const rest = length % pageSize;
            if (rest > 0) {
                //余数大于0，说明实际最后一页数据不足pageSize，应该取size+1为最后一条的页码
                pagingData.page = size + 1;
                pagingData.data = totalData.filter((_, index) => index >= pageSize * size && index <= length);
            } else if (rest === 0) {
                //余数等于0，最后一页数据条数正好是pageSize
                pagingData.page = size;
                pagingData.data = totalData.filter((_, index) => index >= pageSize * (size - 1) && index <= length);
            }
        }
    }
    return pagingData;
};

// 解析歌词
const parseLyric = text => {
    let result = [];
    let lines = text.split('\n');
    let pattern = /\[\d{2}:\d{2}.\d{2,3}\]/g;
    //去掉不含时间的行
    while (!pattern.test(lines[0])) {
        lines = lines.slice(1);
    }
    //上面用'\n'生成数组时，结果中最后一个为空元素，这里将去掉
    lines[lines.length - 1].length === 0 && lines.pop();
    lines.forEach((v, i, a) => {
        let time = v.match(pattern);
        let value = v.replace(pattern, '');
        time.forEach((v1, i1, a1) => {
            let t = v1.slice(1, -1).split(':');
            result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
        });
    });
    result.sort((a, b) => {
        return a[0] - b[0];
    });
    return result;
};

module.exports = {
    isEmpty,
    debounce,
    throttle,
    getPagingData,
    parseLyric,
};
