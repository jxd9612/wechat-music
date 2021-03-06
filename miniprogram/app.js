const musicManage = wx.getBackgroundAudioManager();

App({
    onLaunch: function () {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力');
        } else {
            wx.cloud.init({
                // env 参数说明：
                //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
                //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
                //   如不填则使用默认环境（第一个创建的环境）
                // env: 'my-env-id',
                traceUser: true,
            });
        }
        this.watchMusicStatus();
    },

    watchMusicStatus() {
        musicManage.onPlay(() => {
            this.globalData.playStatus = 1;
        });
        musicManage.onPause(() => {
            this.globalData.playStatus = 2;
        });
        musicManage.onStop(() => {
            this.globalData.playStatus = 0;
        });
    },

    globalData: {
        playStatus: 0, // 音乐播放状态，0-停止 | 1-播放 | 2-暂停
        songId: 0, // 当前播放歌曲的 Id
        playMusicInfo: {}, // playMusic 暂存数据
    },
});
