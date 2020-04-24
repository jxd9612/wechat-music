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
        playStatus: 0, // 当前歌曲播放状态
    },

    onLoad(options) {
        this.setData({
            id: options.id,
            songId: app.globalData.songId,
            playStatus: app.globalData.playStatus,
        });
        this.init();
        this.watchMusicStatus();
    },

    onReachBottom() {
        let oldPagingData = this.data.pagingData;
        let newPagingData = util.tools.getPagingData(oldPagingData.page + 1, oldPagingData.pageSize, this.data.playlist.tracks);
        if (oldPagingData.page === newPagingData.page) return;
        util.wx.showLoading();
        newPagingData.data = oldPagingData.data.concat(newPagingData.data);
        this.setData({ pagingData: newPagingData });
        util.wx.hideLoading();
    },

    watchMusicStatus() {
        musicManage.onPlay(() => {
            app.globalData.playStatus = 1;
            this.setData({ playStatus: app.globalData.playStatus });
        });
        musicManage.onPause(() => {
            app.globalData.playStatus = 2;
            this.setData({ playStatus: app.globalData.playStatus });
        });
        musicManage.onStop(() => {
            app.globalData.playStatus = 0;
            this.setData({ playStatus: app.globalData.playStatus });
        });
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
                    subscribedCount: this.dealSubscribedCount(res.playlist.subscribedCount),
                });
            })
            .finally(() => {
                util.wx.hideLoading();
                this.setData({ isLoading: true });
            });
    },

    songClick(ev) {
        let songId = this.data.playlist.tracks[ev.currentTarget.dataset.index].id;
        if (app.globalData.playStatus !== 0 && app.globalData.songId === songId) {
            if (app.globalData.playStatus === 1) musicManage.pause();
            if (app.globalData.playStatus === 2) musicManage.play();
            return;
        } else {
            app.globalData.songId = songId;
            this.setData({ songId: songId });
            let reqData = { id: songId };
            util.request.get(api.getSong, reqData).then(res => {
                musicManage.src = res.data[0].url;
                musicManage.title = this.data.playlist.tracks[ev.currentTarget.dataset.index].name;
            });
        }
    },

    dealSubscribedCount(count) {
        if (count >= 10000 && count < 100000000) return (count / 10000).toFixed(2) + '万';
        else if (count >= 100000000) return (count / 100000000).toFixed(2) + '亿';
        else return count + '';
    },
});
