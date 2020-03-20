const createCityPicker = require('./cityPicker');


// dep
// <script src="/static/js/lib/better-scroll.js"></script>
// 当需要兼容pc
// <script src="/static/js/lib/better-scroll-wheel.js"></script>

const defaultOptions = {
  // 当前选择的城市
  choosed: null,
  // 当前选择城市定位按钮
  choosedIsLocate: true,
  // 热门城市
  hotCityList: [
    {province: 'beijing', provinceName: '北京'},
    {province: 'tianjin', provinceName: '天津'},
    {province: 'shanghai', provinceName: '上海'},
    {province: 'chongqing', provinceName: '重庆'}
  ],
  // 热门省份
  hotProvinceList: [
    {province: 'hubei', provinceName: '湖北'},
    {province: 'guangdong', provinceName: '广东'},
    {province: 'henan', provinceName: '河南'},
    {province: 'zhejiang', provinceName: '浙江'},
    {province: 'hunan', provinceName: '湖南'},
    {province: 'anhui', provinceName: '安徽'}
  ],
  // 搜索框
  showSearchBar: true,
  // 侧边导航栏
  showNav: true,
  // 直辖市区县切换按钮
  showSwitchDistrict: true
}

module.exports = (options = defaultOptions) => {
  return (opt = {}) => {
    return new Promise((resolve, reject) => {
      options.defer = {};
      options.defer.resolve = resolve;
      options.defer.reject = reject;
      options = createCityPicker($.extend(options, opt));
    });
  }
}