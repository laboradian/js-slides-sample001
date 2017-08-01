/* global */
import '../../node_modules/bootstrap-sass/assets/javascripts/bootstrap.js';
import 'babel-polyfill'

//import _ from 'lodash'

// index.html ファイルをコピーする
require('file-loader?name=../../dist/[name].[ext]!../index.html');

require('file-loader?name=../../dist/img/[name].[ext]!../img/background.jpg');

console.log('%c 🌈 Laboradian.com 🌈 %c http://laboradian.com ',
  'background: #2383BF; color: #fff; font-size: 1.4em;',
  'background: #e3e3e3; color: #000; margin-bottom: 1px; padding-top: 4px; padding-bottom: 1px;');


// 現在表示しているページ番号(1から始まる)(初期だけは0がセットされる)
let current_page_num = 0;
// ページを表すsectionタグのidがセットされる配列
const pages = [];

window.addEventListener('load', () => {

  buildPages();

  if (location.hash === '') {
    setPage(1);
  } else {
    setPage(parseInt(location.hash.slice(1)));
  }
});

/**
 * pages配列を生成する
 */
const buildPages = () => {
  const sections = document.querySelector('#lr-container').querySelectorAll('section');
  sections.forEach((elm) => {
    pages.push(elm.id);
  });
};

/**
 * 目的のページに遷移する
 * @param {number} target_page_num
 * @param {boolean} onPopstate
 */
const setPage = (target_page_num, onPopstate=false) => {

  if (target_page_num < 1) {
    target_page_num = 1;
  } else if (target_page_num > pages.length) {
    target_page_num = pages.length;
  }

  const target_page_id = pages[target_page_num - 1];

  pages.forEach((page_id) => {
    const pageElm = document.querySelector(`#${page_id}`);
    if (page_id == target_page_id) {
      pageElm.style.display = 'block';
    } else {
      pageElm.style.display = 'none';
    }
  });

  if (current_page_num === target_page_num) {
    return;
  }

  // ページ数を表示する
  updatePageNumber(target_page_num);

  if (onPopstate === false) {
    if (current_page_num === 0) {
      history.replaceState({}, target_page_num, `#${target_page_num}`);
    } else {
      history.pushState({}, target_page_num, `#${target_page_num}`);
    }
  }
  current_page_num = target_page_num;
};

const updatePageNumber = (target_page_num) => {
  const pageInfoElm = document.querySelector('#pageInfo');
  if (pageInfoElm.hasChildNodes()) {
    pageInfoElm.removeChild(pageInfoElm.childNodes[0]);
  }
  pageInfoElm.appendChild(
    document.createTextNode(`${target_page_num} / ${pages.length}`)
  );
};

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowRight':
    case 'j':
    case 'l':
      setPage(current_page_num + 1);
      break;
    case 'ArrowLeft':
    case 'k':
    case 'h':
      setPage(current_page_num - 1);
      break;
    case '0':
      setPage(1);
      break;
    case '$':
      setPage(pages.length);
      break;
    default:
      break;
  }
});

window.addEventListener('popstate', (/*event*/) => {
  setPage(parseInt(location.hash.slice(1)), true);
});

document.querySelector('#icon-fast-backward').addEventListener('click', () => {
  setPage(1);
});
document.querySelector('#icon-backward').addEventListener('click', () => {
  setPage(current_page_num - 1);
});
document.querySelector('#icon-forward').addEventListener('click', () => {
  setPage(current_page_num + 1);
});
document.querySelector('#icon-fast-forward').addEventListener('click', () => {
  setPage(pages.length);
});

