const computedBehavior = require('miniprogram-computed');

Component({
    behaviors: [computedBehavior],

    // 组件的属性列表
    properties: {
        item: {
            type: Object,
            value: {},
        },
    },

    // 组件的初始数据
    data: {
        playCount: '', // 播放数量
    },

    watch: {
        item(val) {
            if (val) this.setData({ playCount: this.dealPlayCount(val.playCount) });
        },
    },

    // 组件的方法列表
    methods: {
        dealPlayCount(count) {
            if (count >= 10000) return (count / 10000).toFixed(2) + '万';
            else if (count >= 100000000) return (count / 100000000).toFixed(2) + '亿';
            else return count + '';
        },
    },
});
