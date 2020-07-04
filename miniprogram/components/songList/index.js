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
            if (val)
                this.setData({
                    playCount:
                        val.playCount >= 10000 && val.playCount < 100000000
                            ? (val.playCount / 10000).toFixed(2) + '万'
                            : val.playCount >= 100000000
                            ? (val.playCount / 100000000).toFixed(2) + '亿'
                            : val.playCount + '',
                });
        },
    },

    // 组件的方法列表
    methods: {},
});
