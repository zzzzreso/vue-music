import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import store from './store'

import 'common/stylus/index.styl'
import VueLazyload from 'vue-lazyload'

fastclick.attach(document.body)

Vue.use(VueLazyload, {
  loading: require('common/image/default.png')
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
