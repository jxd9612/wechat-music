const app = getApp();
const util = require('../../utils/index');
const api = require('../../config/api');
const musicManage = wx.getBackgroundAudioManager();

Page({
    data: {
        id: '', // 歌单 id
        playlist: {}, // 歌单详细
        pagingData: {}, // 歌曲分页数据
        isLoading: false, // 数据加载时，隐藏页面用
        subscribedCount: '', // 收藏数量
        songId: 0, // 当前歌曲的 Id
    },

    onLoad(options) {
        // 获取歌单 id，歌曲 id 和 播放状态
        this.setData({ id: options.id, songId: app.globalData.songId });
        this.init();
    },

    onReachBottom() {
        // 分页
        let oldPagingData = this.data.pagingData;
        let newPagingData = util.tools.getPagingData(oldPagingData.page + 1, oldPagingData.pageSize, this.data.playlist.tracks);
        if (oldPagingData.page === newPagingData.page) return;
        util.wx.showLoading();
        newPagingData.data = oldPagingData.data.concat(newPagingData.data);
        this.setData({ pagingData: newPagingData });
        util.wx.hideLoading();
    },

    init() {
        this.handleSongListDetail();
    },

    // 获取歌单详细内容
    handleSongListDetail() {
        util.wx.showLoading();
        let reqData = { id: this.data.id };
        util.request
            .get(api.getSongListDetail, reqData)
            .then(res => {
                this.setData({
                    playlist: res.playlist,
                    pagingData: util.tools.getPagingData(1, 20, res.playlist.tracks),
                    subscribedCount:
                        res.playlist.subscribedCount >= 10000 && res.playlist.subscribedCount < 100000000
                            ? (res.playlist.subscribedCount / 10000).toFixed(2) + '万'
                            : res.playlist.subscribedCount >= 100000000
                            ? (res.playlist.subscribedCount / 100000000).toFixed(2) + '亿'
                            : res.playlist.subscribedCount + '',
                });
            })
            .finally(() => {
                util.wx.hideLoading();
                this.setData({ isLoading: true });
            });
    },

    songClick: util.tools.throttle(function (ev) {
        util.router.navigateTo('playMusic', { id: ev.currentTarget.dataset.id }).then(res => {
            this.setData({ songId: ev.currentTarget.dataset.id });
            app.globalData.songId = ev.currentTarget.dataset.id;
        });
    }, 1500),

    showDesc() {
        wx.showModal({
            title: '提示',
            content: this.data.playlist.description,
            confirmText: '我知道了',
            showCancel: false,
        });
    },
});
