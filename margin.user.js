// ==UserScript==
// @name         映间 MARGIN（B 站界面重设计 · 油猴版）
// @name:en      MARGIN for Bilibili (userscript)
// @namespace    https://github.com/Sam5440/bilibili-margin-userscript
// @version      0.60.63
// @description  给 B 站换一个更清晰的界面：编辑式排版、液态玻璃控件、动态背景、足迹热力图，保留原生播放器/弹幕/评论。由 MV3 扩展打包成的油猴脚本。
// @author       jiuyang5354（原扩展作者）· 油猴移植版
// @license      MIT
// @icon         https://cdn.jsdelivr.net/gh/Sam5440/bilibili-margin-userscript@main/public/icons/128.png
// @homepageURL  https://github.com/Sam5440/bilibili-margin-userscript
// @supportURL   https://github.com/Sam5440/bilibili-margin-userscript/issues
// @updateURL    https://raw.githubusercontent.com/Sam5440/bilibili-margin-userscript/main/margin.user.js
// @downloadURL  https://raw.githubusercontent.com/Sam5440/bilibili-margin-userscript/main/margin.user.js
// @match        https://www.bilibili.com/*
// @match        https://search.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://t.bilibili.com/*
// @match        https://message.bilibili.com/*
// @match        https://live.bilibili.com/*
// @run-at       document-start
// @noframes
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      app.bilibili.com
// @connect      bsbsb.top
// @connect      api.github.com
// @connect      ipwho.is
// @connect      api.open-meteo.com
// @connect      geocoding-api.open-meteo.com
// @connect      www.nmc.cn
// @connect      cdn.jsdelivr.net
// @connect      gcore.jsdelivr.net
// @connect      raw.githubusercontent.com
// ==/UserScript==

(() => {

/* 主脚本只做两件事：把业务代码取回来、执行。
 * 业务代码在仓库 js/margin-app.js；首次取回后写进 GM 存储（键带版本号），
 * 之后每次打开 0 请求。GM_* 以函数参数注入，兼容各管理器的沙箱实现。 */

function mgReadApi(name) { try { return eval(name); } catch (e) { return undefined; } }

const MG_API_NAMES = ['GM_getValue', 'GM_setValue', 'GM_deleteValue', 'GM_listValues', 'GM_addValueChangeListener', 'GM_removeValueChangeListener', 'GM_registerMenuCommand', 'GM_xmlhttpRequest', 'GM_info', 'unsafeWindow'];
const MG_API_VALUES = MG_API_NAMES.map(mgReadApi);
const MARGIN_APP_URL = "https://cdn.jsdelivr.net/gh/Sam5440/bilibili-margin-userscript@main/public/js/margin-app.js";

function mgRunApp(code) {
  try {
    new Function(MG_API_NAMES.join(','), code).apply(null, MG_API_VALUES);
  } catch (err) {
    console.error('[映间 MARGIN] 业务脚本执行失败：', err);
  }
}

function mgFetchApp(url) {
  return new Promise(function (resolve, reject) {
    function ok(text) { resolve(text); }
    function bad(err) { reject(err || new Error('load failed: ' + url)); }
    try {
      if (typeof GM_xmlhttpRequest === 'function') {
        GM_xmlhttpRequest({
          method: 'GET', url: url, timeout: 30000, headers: { Accept: '*' },
          onload: function (r) { (r.status >= 200 && r.status < 300) ? ok(r.responseText) : bad(new Error('HTTP ' + r.status + ' ' + url)); },
          onerror: bad, ontimeout: bad, onabort: bad,
        });
        return;
      }
    } catch (e) { /* 落回原生 fetch */ }
    fetch(url, { credentials: 'omit' })
      .then(function (r) { return r.ok ? r.text().then(ok, bad) : bad(new Error('HTTP ' + r.status + ' ' + url)); })
      .catch(bad);
  });
}

const MG_APP_CACHE = 'margin:app:0.60.63';
let mgCachedApp = null;
try { mgCachedApp = typeof GM_getValue === 'function' ? GM_getValue(MG_APP_CACHE, null) : null; } catch (e) {}

if (typeof mgCachedApp === 'string' && mgCachedApp.length > 1000) {
  mgRunApp(mgCachedApp);
} else {
  mgFetchApp(MARGIN_APP_URL).then(function (code) {
    try { if (typeof GM_setValue === 'function') GM_setValue(MG_APP_CACHE, code); } catch (e) { console.warn('[映间 MARGIN] 业务脚本缓存失败，不影响本次运行'); }
    mgRunApp(code);
  }, function (err) {
    console.error('[映间 MARGIN] 业务脚本加载失败：' + (err && err.message ? err.message : err) + '，检查 ' + MARGIN_APP_URL);
  });
}

})();
