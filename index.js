import { ready } from 'https://lsong.org/scripts/dom.js';
import { h, render, useState, useEffect } from 'https://unpkg.com/htm/preact/standalone.module.js';

const App = () => {
  return [
    h('h2', null, "App"),
    h('ul', null, [
      h('li', null, "Link")
    ])
  ]
}

ready(() => {
  const app = document.getElementById('app');
  render(h(App), app);
});