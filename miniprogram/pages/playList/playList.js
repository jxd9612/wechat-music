const app = getApp();
const util = require('../../utils/index');
const api = require('../../config/api');

Page({
    data: {
        id: '', // 歌单 id
        playlist: {}, // 歌单详细
        isLoading: false, // 数据加载时，隐藏页面用
        subscribedCount: '', // 收藏数量
        songId: 0, // 当前歌曲的 Id
        playStatus: 0, // 当前歌曲播放状态
        playUrl: '', // 歌曲播放地址
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

    watchMusicStatus() {
        // 监听音乐播放
        wx.onBackgroundAudioPlay(() => {
            app.globalData.playStatus = 1;
            this.setData({ playStatus: app.globalData.playStatus });
        });
        // 监听音乐暂停
        wx.onBackgroundAudioPause(() => {
            app.globalData.playStatus = 2;
            this.setData({ playStatus: app.globalData.playStatus });
        });
        // 监听音乐停止
        wx.onBackgroundAudioStop(() => {
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
            if (app.globalData.playStatus === 1) wx.pauseBackgroundAudio();
            if (app.globalData.playStatus === 2) wx.playBackgroundAudio();
            return;
        } else {
            app.globalData.songId = songId;
            this.setData({ songId: songId });
            let reqData = { id: songId };
            util.request.get(api.getSong, reqData).then(res => {
                this.setData({ playUrl: res.data[0].url });
                wx.playBackgroundAudio({
                    dataUrl: res.data[0].url,
                    title: this.data.playlist.tracks[ev.currentTarget.dataset.index].name,
                });
            });
        }
    },

    dealSubscribedCount(count) {
        if (count >= 10000 && count < 100000000) return (count / 10000).toFixed(2) + '万';
        else if (count >= 100000000) return (count / 100000000).toFixed(2) + '亿';
        else return count + '';
    },
});
