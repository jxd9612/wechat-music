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

module.exports = {
    isEmpty,
    debounce,
    throttle,
};
