const {getCityList, getCity2Province, getProvinceList} = require('./utils');


let flag = true;
const data = getProvinceList().concat(getCityList());
const city2Province = getCity2Province();

$('body').on('click', '.search-cancel', function () {
  $('.city-picker-search').remove();
})
.on('input', '.search-placeholder', function ({target: {value}}) {
  if (!flag) return;
  onSearch(value);
})
.on('compositionstart', '.search-placeholder', function(){
  flag = false;
})
.on('compositionend','.search-placeholder', function({target: {value}}){
  flag = true;
  onSearch(value);
})
.on('click', '.city-picker-search-del', function () {
  $('.search-placeholder').val('');
  onSearch('');
  $(this).remove();
})

function render() {
  return `
    <div class="city-picker city-picker-search">
      <div class="header">
        <h3 class="back"></h3>
        <div class="search">
          <input class="search-placeholder" placeholder="请输入城市名称" />
          <p class="search-cancel">取消</p>
        </div>
      </div>
      <div class="city-picker-search-list__wrapper">
        <ul class="city-picker-search-list"></ul>
      </div>
    </div>
  `
}

function renderItem({province, provinceName, contentStr}) {
  const parent = city2Province[provinceName];
  const pv = parent ? parent.pinyin : province;
  const pvn = parent ? parent.name : provinceName;
  const cityName = parent ? provinceName : '';
  return `
    <div
      class="scroll-city-container"
      data-pv="${pv}"
      data-pvn="${pvn}"
      data-city="${cityName}"
    >
      <div class="scroll-city">${contentStr} ${parent ? `<span class="city-picker-search-hitparent">${parent.name}</span>` : ''}</div>
    </div>
  `
}
function commitList(listData) {
  $('.city-picker-search-list').html(listData.map(renderItem).join(''));
}

function getHitWord(value) {
  return data.filter(({name, pinyin}) => {
    return value && name.indexOf(value) !== -1;
  }).map(({name, pinyin}) => {
    const len = value.length;
    const from = name.indexOf(value);
    const to = from + len;
    const hit = name.slice(from, to);
    if (from === 0) {
      return ['', hit, name.slice(to), name, pinyin];
    }
    return [name.slice(0, from), hit, name.slice(to), name, pinyin];
  })
}
function onSearch(value = '') {
  commitDelBtn(value.length);
  const list = getHitWord(value).map(([preffix, hit, suffix, name, pinyin]) => {
    return {
      provinceName: name,
      province: pinyin,
      contentStr: `${preffix}<span class="city-picker-search-hitword">${hit}</span>${suffix}`
    };
  })
  commitList(list);
}
function renderDelBtn() {
  return `<div class="city-picker-search-del"></div>`
}
function commitDelBtn(isShow) {
  if (isShow) {
    if ($('.city-picker-search-del')[0]) return;
    return $('.city-picker-search .search').append(renderDelBtn());
  }
  $('.city-picker-search-del').remove();
}


module.exports = () => {
  $('.city-picker').append(render());
  const $input = $('.search-placeholder');
  $input.focus();
}