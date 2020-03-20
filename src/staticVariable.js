const ua = window.navigator.userAgent;
const isIOS = /iphone|ipad|qhbrowser/i.test(ua);
const isAndroid = /Android/i.test(ua);
const isPC = !isAndroid && !isIOS;

module.exports = {
  isIOS,
  isAndroid,
  isPC
}