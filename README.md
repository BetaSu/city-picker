# 城市选择器
基于原生JS实现的城市选择器
## 安装
支持UMD形式
```
npm i city-picker-mob;
```
## DEMO
<a href="https://betasu.github.io/city-picker/">示例</a>
# 使用（UMD）
```javascript
  const cp = window.cityPicker();
  cp({choosed: '北京'}).then(({provinceName, cityName}) => {
    console.log([provinceName, cityName].filter(a => a).join('|'));
  }, () => {
    console.log('取消');
  })
```
## 配置
```javascript
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
```
## 移动端适配

项目使用`px`作为单位，移动端适配可以考虑使用<a href="https://github.com/ant-design/ant-design-mobile/wiki/HD">antDesign-mobile高清方案</a>