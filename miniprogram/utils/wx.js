const showLoading = (title = '加载中...', mask = true) => wx.showLoading({ title: title, mask: mask });

const hideLoading = (wait = 500) => setTimeout(wx.hideLoading, wait);

const musicManage = wx.getBackgroundAudioManager();

module.exports = {
    showLoading,
    hideLoading,
    musicManage,
};
