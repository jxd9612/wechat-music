const app = getApp();
const util = require('../../utils/index');
const api = require('../../config/api');

Page({
    data: {
        active: 1, // 0-我的，1-发现，2-视频
        banners: [], // 轮播图
        bannerCur: 0, // 轮播当前图片索引
        recSongList: [], // 推荐歌单列表
    },

    onLoad() {
        this.init();
    },
    // 初始化操作
    init() {
        switch (this.data.active) {
            case 0:
                console.log('我的页面');
                break;
            case 1:
                this.handleFind();
                break;
            case 2:
                console.log('视频页面');
                break;
        }
    },

    // 切换标签触发
    onTabChange(ev) {
        this.setData({ active: ev.detail.name });
        this.init();
    },

    // 轮播切换
    onSwiperChange(ev) {
        this.setData({ bannerCur: ev.detail.current });
    },

    // 获取发现部分内容
    handleFind() {
        if (util.tools.isEmpty(this.data.banners)) {
            let reqData = { type: 1 };
            util.request.get(api.getBanner, reqData).then(res => {
                this.setData({ banners: res.banners });
            });
        }
        if (util.tools.isEmpty(this.data.recSongList)) {
            let reqData = { limit: 6 };
            util.request.get(api.getRecSongList, reqData).then(res => {
                this.setData({ recSongList: res.result });
            });
        }
    },

    // 歌单跳转
    toPlayList: util.tools.throttle(function (ev) {
        util.router.navigateTo('playList', { id: ev.currentTarget.dataset.id });
    }, 1500),
});
