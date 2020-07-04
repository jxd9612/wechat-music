const app = getApp();
const util = require('../../utils/index');
const api = require('../../config/api');

Page({
    data: {
        allMatch: [], // 搜索建议
        searchVal: '', // 搜索关键字
        searchHot: [], // 热搜榜
        history: [], // 历史记录
    },

    onLoad() {
        this.setData({ history: wx.getStorageSync('keywordList') });
        this.init();
    },

    init() {
        this.handleSearchHot();
    },

    handleSearchHot() {
        util.wx.showLoading();
        util.request
            .get(api.getSearchHot)
            .then(res => {
                this.setData({ searchHot: res.data });
            })
            .finally(() => {
                util.wx.hideLoading();
            });
    },

    inputChange: util.tools.debounce(
        function (ev) {
            if (!ev.detail) return;
            let reqData = { keywords: ev.detail, type: 'mobile' };
            util.request.get(api.searchSuggest, reqData).then(res => {
                this.setData({ allMatch: res.result.allMatch || [] });
            });
        },
        300,
        false
    ),

    search(ev) {
        let keyword = ev.currentTarget.dataset.keyword || ev.detail;
        this.setData({ searchVal: keyword });
        let reqData = { keywords: keyword };
        util.request
            .get(api.search, reqData)
            .then(res => {
                console.log(res);
            })
            .finally(() => {
                let keywordList = wx.getStorageSync('keywordList') || [];
                if (keywordList.length > 10) keywordList.pop();
                keywordList.unshift(keyword);
                wx.setStorageSync('keywordList', [...new Set(keywordList)]);
                this.setData({ history: wx.getStorageSync('keywordList') });
            });
    },
});
