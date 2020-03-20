let BScroll = require('better-scroll');
BScroll = BScroll.default ? BScroll.default : BScroll;
const staticVariable = require('./staticVariable');
const serachBox = require('./search');
const {getProvinceListWithoutMunicipality, getCityListIncludeMunicipality, isMunicipality, getCity2Province, getCityListFromProvinceName} = require('./utils');
require('./style.css');

let eventIsBind;

const options = {
  current: createCityPicker()
}

function bindEvent() {
  if (eventIsBind) return;
  eventIsBind = true;
  $('body')
  .on('click', '.city-picker .city-picker-tab-item', function () {
    const $t = $(this);
    const type = $t.data('type');
    if ($t.hasClass('active')) {
      return;
    } else {
      if (type === 'province') {
        return updateListData(getProvinceListWithoutMunicipality());
      }
      updateListData(type === 'province' ? getProvinceListWithoutMunicipality() : getCityListIncludeMunicipality());
      tab.commit();
    }
  })  
  .on('click', '.city-picker .back', function () {
    options.current.close();
  })
  .on('click', '.city-picker .city-picker-switch', function () {
    const $t = $(this);
    commitChildren(!$t.hasClass('active'));
    options.current.calculateHeight();
    options.current.scroll.refresh();
  })
  .on('click', '.city-picker p.search-placeholder', function () {
    serachBox();
  })
  .on('touchstart', '.city-picker .navs .nav', function (e) {
    options.current.navTouchStart(e);
  })
  .on('touchmove', '.city-picker .navs .nav', function (e) {
    e.stopPropagation();
    options.current.navTouchMove(e);
  })
  .on('touchstart', '.city-picker .scroll-city-container', function () {
    const $t = $(this);
    options.current.cityActiveStart($t.data('name'));
  }) 
  .on('touchend', '.city-picker .scroll-city-container', function () {
    options.current.cityActiveEnd();
  })
  .on('click', '.city-picker .scroll-city-container, .city-picker-hot-item, .city-picker-child', function () {
    const $t = $(this);
    options.current.close({
      province: $t.data('pv'),
      provinceName: $t.data('pvn'),
      cityName: $t.data('city')
    });
  })
}

const tab = {
  render() {
    return `
      <div class="city-picker-tab">
        <p class="city-picker-tab-item" data-type="city">选择城市</p>
        <p class="city-picker-tab-item" data-type="province">选择省份</p>
      </div>
    `
  },
  commit() {
    $('.city-picker-tab-item').removeClass('active');
    $(`.city-picker-tab-item[data-type="${options.current.curTabIsProvince ? 'province' : 'city'}"]`).addClass('active');
  }
}

function renderChild({name, pinyin}) {
  const parent = getCity2Province()[name];
  const pv = parent ? parent.pinyin : pinyin;
  const pvn = parent ? parent.name : name;
  const cityName = parent ? name : '';
  return `
    <li 
      class="city-picker-child"
      data-pv="${pv}"
      data-pvn="${pvn}"
      data-city="${cityName}"
    >
      ${name}
    </div>
  `
}

function commitChildren(isAdd) {
  let list = [];
  if (isAdd) {
    $('.city-picker-switch').addClass('active');
    list = getCityListFromProvinceName(options.choosed);
    if (!list.length) {
      const {name} = getCity2Province()[options.choosed] || {};
      list = getCityListFromProvinceName(name);
    }
  } else {
    $('.city-picker-switch').removeClass('active');
  }
  if (!list) return;
  $('.city-picker-children').html(list.map(renderChild).join(''));
}

function renderScrollItem({value, list}, i) {
  if (value === '热') {
    return `
      <li class="scroll-item scroll-item--hot">
        <div class="scroll-title" data-ref="${i}">
          ${renderHot('热门城市', 'city-picker-hc')}
          ${renderHot('热门省份', 'city-picker-hp')}
        </div>
      </li>
    `
  }
  return `
      <li class="scroll-item">
        <p class="scroll-title" data-ref="${i}">${value}</p>
        <div class="scroll-citys">
          ${list.map(renderCityItem).join('')}
        </div>
      </li>
  `
}
function renderCityItem({province, provinceName}) {
  const parent = getCity2Province()[provinceName];
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
      <div class="scroll-city">${provinceName}</div>
    </div>
  `
}

function updateCityActive() {
  const name = options.choosed;
  const zoneTag = options.current.curTabIsProvince ? 'pvn' : 'city';
  $('.city-picker .scroll-city-container').each((_, dom) => {
    const $dom = $(dom);
    $dom.removeClass('cityActive');
    if ($dom.data(zoneTag) === name) {
      $dom.addClass('cityActive');
    }
  })
  $('.city-picker .city-picker-hot-item').each((_, dom) => {
    const $dom = $(dom);
    $dom.removeClass('active');
    if ($dom.data(zoneTag) === name) {
      $dom.addClass('active');
    }
  })
}

function renderNav({value}, i) {
  return `<li class="nav" data-value="${value}" data-key="${i}">${value}</li>`;
}

function updateNavItemActive(i) {
  $('.city-picker .navs .nav').removeClass('navActive');
  $(`.city-picker .navs .nav[data-key="${i}"]`).addClass('navActive');
}

function renderHot(title, className = '') {
  return `
    <div class="city-picker-hot ${className}">
      <h3>${title}</h3>
      <ul class="city-picker-hot-list"></ul>
    </div>
  `
}
function commitSearch(isShow) {
  if (!isShow) {
    return $('.city-picker .search-ph').removeClass('search').html('');
  }
  $('.city-picker .search-ph').addClass('search').html('<p class="search-placeholder">请输入城市名称</p>');
}

function render() {
  return `
    <div class="city-picker">
      <div class="header">
        <h3 class="back"></h3>
        <div class="search-ph"></div>
        ${tab.render()}
      </div>
      <div class="city-picker-scroll__wrapper scroll-list" ref="scroller">
        <ul class="content">
          <div class="top-container">
            <div class="location">
              <i class="mark"></i>
              <span class="city">${options.choosed ? `当前定位：${options.choosed}` : ''}</span>
              <div class="city-picker-switch">切换区县</div>
            </div>
            <ul class="city-picker-children"></ul>
          </div>
        </ul>
      </div>
      <ul class="navs"></ul>
    </div>
  `  
};

function renderHotItem({province, provinceName}) {
  return `<li class="city-picker-hot-item" data-pv="${province}" data-pvn="${provinceName}">${provinceName}</li>`
}

function commitList() {
  $('.city-picker .scroll-item').remove();
  $('.city-picker .content').append(options.current.innerCity.map(renderScrollItem).join(''));
}

function commitNavs() {
  if (!options.showNav) return;
  $('.city-picker .navs').html(options.current.innerCity.map(renderNav).join(''));
}

function commitHot(className, data) {
  const $ul = $(`.city-picker-hot.${className} ul`);
  if (!$ul.length) return;
  $ul.html(data.map(renderHotItem).join(''));
}

function commitHotByTabType() {
  $('.city-picker-hot').css('display', 'none');
  const {hotCityList, hotProvinceList, current: {curTabIsProvince}} = options;
  const data = curTabIsProvince ? hotProvinceList : hotCityList;
  if (!data || !data.length) return;
  if (!curTabIsProvince) {
    $('.city-picker-hc').css('display', 'block')
    return commitHot('city-picker-hc', data);
  }
  $('.city-picker-hp').css('display', 'block')
  commitHot('city-picker-hp', data);
}
// 直辖市才显示切换区县
function commitSwitch() {
  $('.city-picker')[isMunicipality(options.choosed) ? 'addClass' : 'removeClass']('city-picker--ismunicipality');
}

function createCityPicker() {
  return {
    innerCity: null,
    curLocateZone: '',
    listHeight: [],
    scrollFlag: false,
    scrollY: 0,
    currCoverCity: "",
    // 记录 当前的 move位置
    navTouch: {} ,
    close(data) {
      $('.city-picker').css('display', 'none');
      $('.city-picker-search').remove();
      $('body').removeClass('city-picker-oh');
      commitChildren();
      if (data) {
        return options.defer.resolve(data);
      }
      options.defer.reject();
    },
    initScroll() {
      if (!this.scroll) {
        // BScroll.use(window.MouseWheel);
        this.scroll = new BScroll(".city-picker-scroll__wrapper", {
          scrollY: true,
          click: true,
          disableMouse: false,
          disableTouch: false,
          probeType: 3,
          mouseWheel: {
            speed: 20,
            invert: false,
            easeTime: 300
          }
        });
      } 

      this.scroll.on("scroll", ({y}) => {
        this.scrollFlag = true;
        const listHeight = this.listHeight;
        // 当滚动到顶部，newY>0
        if (y > 0) {
          updateNavItemActive(0);
          return;
        }
        // 在中间部分滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i];
          let height2 = listHeight[i + 1];
          if (-y >= height1 && -y < height2) {
            updateNavItemActive(i);
            return;
          }
        }
        // 当滚动到底部，且-newY大于最后一个元素的上限;
        updateNavItemActive(listHeight.length - 2);
      });
    },
    calcData(citys) {
      options.current.curTabIsProvince = citys.length < 200;
      const tempList = {};
      citys
      .sort((a, b) => a.pinyin - b.pinyin)
      .forEach(({pinyin, name}) => {
        const firstLetter = pinyin.charAt(0).toUpperCase();
        tempList[firstLetter] = tempList[firstLetter] || [];
        tempList[firstLetter].push({provinceName: name, province: pinyin});
      })

      const finalList = Object.keys(tempList).sort().map(firstLetter => ({
        value: firstLetter,
        list: tempList[firstLetter]
      }))
      if (options.hotProvinceList)
      finalList.unshift({value: '热'});
      this.innerCityCount = citys.length;
      this.innerCity = finalList;
    },
    calculateHeight() {
      setTimeout(() => {
        this.listHeight = [];
        let top = $(".city-picker .top-container");
        let cityList = $(".city-picker .scroll-item");
        let height = 0;
        this.listHeight.push(height);
        height += top[0].clientHeight;
        // this.listHeight.push(height);
        for (let i = 0; i < cityList.length; i++) {
          let item = cityList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      });
    },
    cityActiveStart(item) {
      this.currCoverCity = item;
    },
    cityActiveEnd() {
      this.currCoverCity = "";
    },
    switchKey(index) {
      // 获取当前字母来cityList中距离顶部的位置
      let targetTop = $(`.scroll-title[data-ref="${index}"]`)[0].offsetTop;
      this.scroll.scrollTo(0, -targetTop + 63);
    },
    navTouchStart(e) {
      // start
      const key = e.target.getAttribute("data-key");
      this.navTouch.anchorIndex = Number(key);
      updateNavItemActive(Number(key));
      this.navTouch.y1 = e.touches[0].pageY;
      this.innerAnchor(key);
    },
    navTouchMove(e) {
      const unitHeight = e.touches[0].target.clientHeight || 16;
      this.navTouch.y2 = e.touches[0].pageY;
      // 计算当前位置与开始位置的差值 index
      const diff = ((this.navTouch.y2 - this.navTouch.y1) / unitHeight) | 0;
      const len = this.innerCity.length;
      const calcIndex = parseInt(this.navTouch.anchorIndex + diff, 10);
      let index = 0;
      if (calcIndex >= len) {
        index = len - 1;
      } else if (calcIndex < 0) {
        index = 0;
      } else {
        index = calcIndex;
      }
      updateNavItemActive(index);
      this.innerAnchor(index);
    },
    innerAnchor(key) {
      // 锚点
      const dom = $(`.scroll-title[data-ref="${key}"]`)[0];
      setTimeout(() => {
        let offsetTop = staticVariable.isIOS ? -dom.offsetTop + 63 : -dom.offsetTop;
        if (staticVariable.isAndroid && !this.scrollFlag) {
          offsetTop = -dom.offsetTop + 63;
        }
        this.scroll.scrollTo(0, offsetTop);
      })
    }
  }
}

function updateListData(data) {
  options.current.calcData(data);
  commitList();
  commitNavs();
  commitHotByTabType();
  updateCityActive();
  tab.commit();
  options.current.calculateHeight();
  options.current.scroll.refresh();
}

module.exports = opt => {
  $.extend(options, opt);
  const $body = $('body').addClass('city-picker-oh');
  const $cp = $('.city-picker');
  const {choosed, current, choosedIsLocate, showSwitchDistrict, showSearchBar} = options;
  if ($cp[0]) {
    $cp.css('display', 'block');
    $cp.find('.location .city').text(`当前定位：${choosed || ''}`);
    current.scroll.scrollTo(0, 0);
  } else {
    $body.append(render());
    current.initScroll();
    bindEvent();
  }
  $cp[choosedIsLocate ? 'addClass' : 'removeClass']('city-picker--locate');

  updateListData(getCityListIncludeMunicipality());
  showSwitchDistrict && commitSwitch();
  commitSearch(showSearchBar);
  return options;
}