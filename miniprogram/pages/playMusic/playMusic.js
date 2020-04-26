const app = getApp();
const util = require('../../utils/index');
const api = require('../../config/api');

Page({
    data: {
        songUrl: '', // 歌曲播放地址
        songDetail: {}, // 歌曲详细
        lyric: [], // 歌词
        marginTop: 0, // 滚动距离
        currentIndex: 0, // 当前正在第几行
    },

    onLoad() {
        this.init();
    },

    init() {
        this.handleSong();
    },

    handleSong() {
        util.request
            .get(api.getSong, { id: 32785674 })
            .then(res => {
                if (res.data[0].url) {
                    this.setData({ songUrl: res.data[0].url });
                    this.getSongDetail();
                } else {
                    wx.showToast({ title: '无法获取音乐', icon: 'none' });
                }
            })
            .finally(() => {
                util.wx.musicManage.src = this.data.songUrl;
                util.wx.musicManage.title = 'test';
                util.wx.musicManage.onTimeUpdate(() => {
                    this.setData({ marginTop: (this.data.currentIndex - 3) * 26 });
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
            });
    },
    getSongDetail() {
        util.request.get(api.getSongDetail, { ids: 32785674 }).then(res => {
            let songDetail = {
                songPic: res.songs[0].al.picUrl,
                songName: res.songs[0].name,
                songAr: res.songs[0].ar[0].name,
            };
            console.log(songDetail);
            this.setData({ songDetail: songDetail });
        });
        util.request.get(api.getLyric, { id: 32785674 }).then(res => {
            this.setData({ lyric: util.tools.parseLyric(res.lrc.lyric) });
        });
    },
});
