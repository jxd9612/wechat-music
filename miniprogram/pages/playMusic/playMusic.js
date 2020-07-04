const app = getApp();
const util = require('../../utils/index');
const api = require('../../config/api');

Page({
    data: {
        id: '',
        songUrl: '', // 歌曲播放地址
        songDetail: {}, // 歌曲详细
        lyric: [], // 歌词
        marginTop: 0, // 滚动距离
        currentIndex: 0, // 当前正在第几行
        playStatus: 0,
    },

    onLoad(options) {
        // 同一首歌曲点击进去不需要重新发送请求
        if (app.globalData.songId == options.id && app.globalData.playStatus !== 0) {
            this.setData({
                songDetail: app.globalData.playMusicInfo.songDetail,
                lyric: app.globalData.playMusicInfo.lyric,
                marginTop: app.globalData.playMusicInfo.marginTop,
                currentIndex: app.globalData.playMusicInfo.currentIndex,
                songUrl: app.globalData.playMusicInfo.songUrl,
            });
            this.watchPlay();
            return;
        }
        this.setData({ id: options.id });
        this.init();
    },

    // 关闭页面时暂存歌曲信息
    onUnload() {
        app.globalData.playMusicInfo = {
            songDetail: this.data.songDetail,
            lyric: this.data.lyric,
            marginTop: this.data.marginTop,
            currentIndex: this.data.currentIndex,
            songUrl: this.data.songUrl,
        };
    },

    init() {
        // 停止上一首播放的音乐
        util.wx.musicManage.stop();
        this.handleSong();
    },

    // 获取歌曲 url
    handleSong() {
        util.request.get(api.getSong, { id: this.data.id }).then(res => {
            if (res.data[0].url) {
                this.setData({ songUrl: res.data[0].url });
                this.getSongDetail();
            } else {
                wx.showModal({
                    title: '提示',
                    content: '无法获取音乐',
                    showCancel: false,
                    success: suc => {
                        if (suc.confirm) util.router.navigateBack();
                    },
                });
            }
        });
    },

    // 获取歌曲的信息（图片、歌名、作者）
    getSongDetail() {
        util.request.get(api.getSongDetail, { ids: this.data.id }).then(res => {
            let songDetail = {
                songPic: res.songs[0].al.picUrl,
                songName: res.songs[0].name,
                songAr: res.songs[0].ar[0].name,
            };
            this.setData({ songDetail: songDetail });
            this.watchPlay();
        });
        util.request.get(api.getLyric, { id: this.data.id }).then(res => {
            if (res.lrc.lyric) this.setData({ lyric: util.tools.parseLyric(res.lrc.lyric) });
        });
    },

    // 音乐播放
    watchPlay() {
        util.wx.musicManage.src = this.data.songUrl;
        util.wx.musicManage.title = this.data.songDetail.songName;
        util.wx.musicManage.coverImgUrl = this.data.songDetail.songPic;
        util.wx.musicManage.onTimeUpdate(() => {
            this.setData({ marginTop: (this.data.currentIndex - 2) * 28 });
            if (this.data.currentIndex != this.data.lyric.length - 1) {
                for (let j = 0; j < this.data.lyric.length; j++) {
                    if (this.data.currentIndex == this.data.lyric.length - 2) {
                        //最后一行只能与前一行时间比较
                        if (parseFloat(util.wx.musicManage.currentTime) > parseFloat(this.data.lyric[this.data.lyric.length - 1][0])) {
                            this.setData({ currentIndex: this.data.lyric.length - 1 });
                            return;
                        }
                    } else if (
                        parseFloat(util.wx.musicManage.currentTime) > parseFloat(this.data.lyric[j][0]) &&
                        parseFloat(util.wx.musicManage.currentTime) < parseFloat(this.data.lyric[j + 1][0])
                    ) {
                        this.setData({ currentIndex: j });
                        return;
                    }
                }
            }
        });
    },

    // 播放 / 暂停 按钮点击
    btnClick: util.tools.throttle(function (ev) {
        if (!util.wx.musicManage.src) return;
        if (app.globalData.playStatus === 1) util.wx.musicManage.pause();
        if (app.globalData.playStatus === 2) util.wx.musicManage.play();
        this.setData({ playStatus: app.globalData.playStatus });
    }, 500),
});
