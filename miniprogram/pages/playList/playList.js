const app = getApp();
const util = require('../../utils/index');
const api = require('../../config/api');

Page({
    data: {
        id: '', // 歌单 id
        playlist: {}, // 歌单详细
        isLoading: false, // 数据加载时，隐藏页面用
        subscribedCount: '', // 收藏数量
    },

    onLoad(options) {
        this.setData({ id: options.id || '497230439' });
        this.init();
    },

    init() {
        this.handleSongListDetail();
    },

    handleSongListDetail() {
        util.wx.showLoading();
        let reqData = { id: this.data.id };
        util.request
            .get(api.getSongListDetail, reqData)
            .then(res => {
                this.setData({
                    playlist: res.playlist,
                    subscribedCount: this.detailSubscribedCount(res.playlist.subscribedCount),
                });
            })
            .finally(() => {
                util.wx.hideLoading();
                this.setData({ isLoading: true });
            });
    },

    detailSubscribedCount(count) {
        if (count >= 10000) return (count / 10000).toFixed(2) + '万';
        else if (count >= 100000000) return (count / 100000000).toFixed(2) + '亿';
        else return count + '';
    },
});
