const ApiRootUrl = 'https://www.jxd9612.world:3000/';

module.exports = {
    /**
     * 获取轮播图
     * type: 资源类型 , 对应以下类型 , 0-PC (默认) | 1-android | 2-iphone | 3-ipad
     */
    getBanner: ApiRootUrl + 'banner',

    /**
     * 获取推荐歌单
     * limit: 取出数量 , 默认为 30 (不支持 offset)
     */
    getRecSongList: ApiRootUrl + 'personalized',

    /**
     * 获取歌单详情
     * id(必选): 歌单 id
     * s: 歌单最近的 s 个收藏者
     */
    getSongListDetail: ApiRootUrl + 'playlist/detail',

    /**
     * 获取音乐 url，传入的音乐 id(可多个 , 用逗号隔开 ),可以获取对应的音乐的 url
     * id(必选): 音乐 id
     * br: 码率,默认设置了 999000 即最大码率,如果要 320k 则可设置为 320000,其他类推
     */
    getSong: ApiRootUrl + 'song/url',

    /**
     * 搜索
     * keywords(必选): 关键词
     * limit: 返回数量 , 默认为 30 offset
     * type: 搜索类型，默认为 1
     *  1-单曲 | 10-专辑 | 100-歌手 | 1000-歌单 | 1002-用户
     *  1004-MV | 1006-歌词 | 1009-电台 | 1014-视频 | 1018-综合
     */
    search: ApiRootUrl + 'search',

    /**
     * 搜索建议
     * keywords(必选): 关键词
     * type: 如果传 'mobile' 则返回移动端数据
     */
    searchSuggest: ApiRootUrl + 'search/suggest',

    /**
     * 热搜榜 详细
     */
    getSearchHot: ApiRootUrl + 'search/hot/detail',
};
