const PROVINCES_MAP = require('./zoneData');

let cityList;
let city2Province;
let provinceList;
// 没有对应二级页
const blackList = ['aomen', 'taiwan', 'xianggang'];
// 直辖市
const municipalityList = [
  {name: '北京', pinyin: 'beijing'},
  {name: '天津', pinyin: 'tianjin'},
  {name: '上海', pinyin: 'shanghai'}, 
  {name: '重庆', pinyin: 'chongqing'}];

exports.getProvinceList = () => {
  if (provinceList) return provinceList;
  return provinceList = PROVINCES_MAP.filter(({pinyin}) => blackList.indexOf(pinyin) === -1);
}

exports.getProvinceListWithoutMunicipality = () => {
  return exports.getProvinceList().filter(({name}) => municipalityList.map(({name}) => name).indexOf(name) === -1);
}

exports.getCityListFromProvinceName = provinceName => {
  let result = [];
  exports.getProvinceList().forEach(({name, cityNames, cityPinyin}) => {
    if (name !== provinceName) return;
    cityNames.forEach((name, i) => {
      result.push({
        name,
        pinyin: cityPinyin[i]
      })
    })
  })
  return result;
}

exports.getCityList = () => {
  if (cityList) return cityList;
  cityList = [];
  exports.getProvinceList().forEach(({cityNames, cityPinyin}) => {
    cityNames.forEach((name, i) => {
      cityList.push({pinyin: cityPinyin[i], name});
    })
  })
  return cityList;
}

exports.getCityListIncludeMunicipality = () => {
  return exports.getCityList().concat(municipalityList);
}

exports.getCity2Province = () => {
  if (city2Province) return city2Province;
  city2Province = {};
  exports.getProvinceList().forEach(({cityNames, pinyin, name: provinceName}) => {
    cityNames.forEach(name => {
      city2Province[name] = {
        name: provinceName,
        pinyin
      }
    })
  })
  return city2Province;
}

// 是省或者直辖市么
exports.isProvinceOrMunicipality = name => {
  let isProvince;
  let isMunicipality;
  const list = exports.getProvinceList();
  for (let i = 0; i < list.length; i++) {
    const {name: n} = list[i];
    if (n === name) {
      isMunicipality = municipalityList.map(({name}) => name).indexOf(name) !== -1;
      isProvince = !isMunicipality;
    }
  }
  return {
    isProvince,
    isMunicipality
  }
}

// 是否是直辖市或者属于直辖市
exports.isMunicipality = name => {
  const {name: parentName} = exports.getCity2Province()[name] || {};
  const municipality = municipalityList.map(({name}) => name);
  return municipality.indexOf(name) !== -1 || municipality.indexOf(parentName) !== -1;
}

// 是否是直辖市或者城市
exports.isMunicipalityOrCity = name => {
  const {name: parentName} = exports.getCity2Province()[name] || {};
  const municipality = municipalityList.map(({name}) => name);
  return municipality.indexOf(name) !== -1 || parentName;
}