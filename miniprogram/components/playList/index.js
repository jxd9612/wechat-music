// const app = getApp();
const computedBehavior = require('miniprogram-computed');

Component({
    behaviors: [computedBehavior],

    // 组件的属性列表
    properties: {
        item: {
            type: Object,
            value: {},
        },
        index: {
            type: Number,
        },
        // 歌曲 Id ，与 item.id 判断当前点击的歌曲条目
        songId: {
            type: Number,
        },
    },

    // 组件的初始数据
    data: {
        desc: '',
    },

    watch: {
        item(val) {
            if (val) this.setData({ desc: this.dealDesc(val.alia) });
        },
    },

    // 组件的方法列表
    methods: {
        dealDesc(alia) {
            return alia.length == 0 ? '' : `${alia[0]}`;
        },
    },
});
