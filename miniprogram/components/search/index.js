Component({
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
    data: {},

    // 组件的方法列表
    methods: {
        inputChange(ev) {
            this.setData({ value: ev.detail.value });
            this.triggerEvent('input', ev.detail.value);
        },

        inputBlur() {
            if (!this.data.value) this.setData({ item: [] });
            // this.triggerEvent('search');
        },

        search(ev) {
            this.triggerEvent('search', ev.currentTarget.dataset.keyword);
        },
    },
});
