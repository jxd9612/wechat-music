const computedBehavior = require('miniprogram-computed');

Component({
    behaviors: [computedBehavior],

    // 组件的属性列表
    properties: {
        placeholder: {
            type: String,
            value: '请输入搜索关键词',
        },
        value: {
            type: String,
            value: '',
        },
        disabled: {
            type: Boolean,
            value: false,
        },
        item: {
            type: Array,
            value: [],
        },
    },

    // 组件的初始数据
    data: {
        flag: true, // 是否显示搜索建议 true-隐藏 | false-显示
    },

    watch: {
        item(val) {
            if (val.length === 0) this.setData({ flag: true });
            else this.setData({ flag: false });
        },
    },

    // 组件的方法列表
    methods: {
        inputChange(ev) {
            this.setData({ value: ev.detail.value });
            this.triggerEvent('input', ev.detail.value);
        },

        inputBlur() {
            this.setData({ flag: true });
        },

        inputFocus() {
            if (this.data.value) this.setData({ flag: false });
        },

        search(ev) {
            this.triggerEvent('search', ev.currentTarget.dataset.keyword);
        },
    },
});
