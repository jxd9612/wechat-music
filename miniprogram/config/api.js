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
    getPersonalized: ApiRootUrl + 'personalized',
};